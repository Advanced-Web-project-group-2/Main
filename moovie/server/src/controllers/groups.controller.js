import pool from '../db.js';

// POST /api/groups
export const createGroup = async (req, res) => {
  try {
    const { name, banner_url = null, icon_url = null } = req.body;
    const userId = req.user && req.user.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!name || String(name).trim().length === 0)
      return res.status(400).json({ error: 'Group name required' });
    if (String(name).length > 100)
      return res.status(400).json({ error: 'Group name too long' });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertGroupText = `
        INSERT INTO groups (name, creator_id, banner_url, icon_url)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, creator_id, created_at
      `;
      const groupRes = await client.query(insertGroupText, [name, userId, banner_url, icon_url]);
      const group = groupRes.rows[0];

      // ensure membership row exists (idempotent): insert if missing, otherwise ensure flags set
      const findMemberRes = await client.query('SELECT id, is_admin, is_member FROM group_user WHERE group_id=$1 AND user_id=$2', [group.id, userId]);
      let membership = null;
      if (findMemberRes.rowCount === 0) {
        const insertMemberText = `
          INSERT INTO group_user (group_id, user_id, is_admin, is_member, is_applied)
          VALUES ($1, $2, true, true, false)
          RETURNING id, group_id, user_id, is_admin, is_member, is_applied
        `;
        const memRes = await client.query(insertMemberText, [group.id, userId]);
        membership = memRes.rows[0];
        // membership created
      } else {
        // membership exists. Making sure, that role is set to admin/member
        const existing = findMemberRes.rows[0];
        if (!existing.is_member || !existing.is_admin) {
          const upd = await client.query('UPDATE group_user SET is_member = true, is_admin = true WHERE group_id=$1 AND user_id=$2 RETURNING id, group_id, user_id, is_admin, is_member, is_applied', [group.id, userId]);
          membership = upd.rows[0];
          // membership updated
        } else {
          membership = { id: existing.id, group_id: group.id, user_id: userId, is_admin: existing.is_admin, is_member: existing.is_member, is_applied: false };
        }
      }

      await client.query('COMMIT');

      // return the created group and membership for client convenience
      return res.status(201).json({ group, membership });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('createGroup transaction error', err);
      return res.status(500).json({ error: 'Failed to create group' });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('createGroup error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const groupId = req.params.id;
    // getGroupById called
    const groupRes = await pool.query('SELECT id, name, creator_id, banner_url, icon_url, created_at FROM groups WHERE id = $1', [groupId]);
    if (groupRes.rowCount === 0) return res.status(404).json({ error: 'Group not found' });

    const group = groupRes.rows[0];

    // fetch members (is_member = true)
    const membersQ = `SELECT u.id as user_id, u.username, gu.is_admin, gu.is_member
      FROM group_user gu
      JOIN users u ON u.id = gu.user_id
      WHERE gu.group_id = $1 AND gu.is_member = true`;
    const membersRes = await pool.query(membersQ, [groupId]);

    // fetch pending requests (is_applied = true)
    const pendingQ = `SELECT u.id as user_id, u.username
      FROM group_user gu
      JOIN users u ON u.id = gu.user_id
      WHERE gu.group_id = $1 AND gu.is_applied = true`;
    const pendingRes = await pool.query(pendingQ, [groupId]);

    return res.json({ group, members: membersRes.rows, pending: pendingRes.rows });
  } catch (err) {
    console.error('getGroupById error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/groups/:id/join  - send join request
export const sendJoinRequest = async (req, res) => {
  try {
    const userId = req.user?.id;
    const groupId = req.params.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // check group exists
    const grp = await pool.query('SELECT id FROM groups WHERE id = $1', [groupId]);
    if (grp.rowCount === 0) return res.status(404).json({ error: 'Group not found' });

    const find = await pool.query('SELECT id, is_member, is_applied FROM group_user WHERE group_id=$1 AND user_id=$2', [groupId, userId]);
    if (find.rowCount > 0) {
      const row = find.rows[0];
      if (row.is_member) return res.status(400).json({ error: 'Already a member' });
      if (row.is_applied) return res.status(200).json({ status: 'pending' });
      // update to applied
      await pool.query('UPDATE group_user SET is_applied = true WHERE id = $1', [row.id]);
      return res.json({ status: 'pending' });
    }

    // create membership row with applied = true
    await pool.query('INSERT INTO group_user (group_id, user_id, is_admin, is_member, is_applied) VALUES ($1, $2, false, false, true)', [groupId, userId]);
    return res.json({ status: 'pending' });
  } catch (err) {
    console.error('sendJoinRequest error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/groups/:id/join  - cancel user's pending request
export const cancelJoinRequest = async (req, res) => {
  try {
    const userId = req.user?.id;
    const groupId = req.params.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const find = await pool.query('SELECT id, is_member, is_applied FROM group_user WHERE group_id=$1 AND user_id=$2', [groupId, userId]);
    if (find.rowCount === 0) return res.status(400).json({ error: 'No request to cancel' });
    const row = find.rows[0];
    if (!row.is_applied) return res.status(400).json({ error: 'No pending request' });
    // If row is not a member, we can delete the row; otherwise just clear applied
    if (!row.is_member) {
      await pool.query('DELETE FROM group_user WHERE id = $1', [row.id]);
    } else {
      await pool.query('UPDATE group_user SET is_applied = false WHERE id = $1', [row.id]);
    }
    return res.json({ status: 'not_member' });
  } catch (err) {
    console.error('cancelJoinRequest error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/groups/:id/join-status - returns membership status for requesting user
export const getJoinStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    const groupId = req.params.id;
    if (!userId) return res.status(200).json({ status: 'not_member' });

    const find = await pool.query('SELECT is_admin, is_member, is_applied FROM group_user WHERE group_id=$1 AND user_id=$2', [groupId, userId]);
    if (find.rowCount === 0) return res.json({ status: 'not_member' });
    const r = find.rows[0];
    if (r.is_member) return res.json({ status: r.is_admin ? 'admin' : 'member' });
    if (r.is_applied) return res.json({ status: 'pending' });
    return res.json({ status: 'not_member' });
  } catch (err) {
    console.error('getJoinStatus error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/groups/:id/requests - admin only: list pending join requests
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user?.id;
    const groupId = req.params.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const isAdmin = await pool.query('SELECT 1 FROM group_user WHERE group_id=$1 AND user_id=$2 AND is_admin = true', [groupId, userId]);
    if (isAdmin.rowCount === 0) return res.status(403).json({ error: 'Forbidden' });

    const q = `SELECT gu.user_id, u.username
      FROM group_user gu
      JOIN users u ON u.id = gu.user_id
      WHERE gu.group_id=$1 AND gu.is_applied = true`;
    const r = await pool.query(q, [groupId]);
    return res.json({ requests: r.rows });
  } catch (err) {
    console.error('getPendingRequests error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/groups/:id/requests/:userId/approve
export const approveRequest = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const groupId = req.params.id;
    const targetUser = req.params.userId;
    if (!adminId) return res.status(401).json({ error: 'Unauthorized' });

    const isAdmin = await pool.query('SELECT 1 FROM group_user WHERE group_id=$1 AND user_id=$2 AND is_admin = true', [groupId, adminId]);
    if (isAdmin.rowCount === 0) return res.status(403).json({ error: 'Forbidden' });

    // If row exists, set is_member true and is_applied false; otherwise insert
    const find = await pool.query('SELECT id FROM group_user WHERE group_id=$1 AND user_id=$2', [groupId, targetUser]);
    if (find.rowCount > 0) {
      await pool.query('UPDATE group_user SET is_member = true, is_applied = false WHERE id = $1', [find.rows[0].id]);
    } else {
      await pool.query('INSERT INTO group_user (group_id, user_id, is_admin, is_member, is_applied) VALUES ($1, $2, false, true, false)', [groupId, targetUser]);
    }
    return res.json({ status: 'member' });
  } catch (err) {
    console.error('approveRequest error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/groups/:id/requests/:userId/reject
export const rejectRequest = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const groupId = req.params.id;
    const targetUser = req.params.userId;
    if (!adminId) return res.status(401).json({ error: 'Unauthorized' });

    const isAdmin = await pool.query('SELECT 1 FROM group_user WHERE group_id=$1 AND user_id=$2 AND is_admin = true', [groupId, adminId]);
    if (isAdmin.rowCount === 0) return res.status(403).json({ error: 'Forbidden' });

    // clear applied flag (or delete row if not member)
    const find = await pool.query('SELECT id, is_member FROM group_user WHERE group_id=$1 AND user_id=$2', [groupId, targetUser]);
    if (find.rowCount === 0) return res.status(400).json({ error: 'No such request' });
    const row = find.rows[0];
    if (row.is_member) {
      // already a member
      return res.status(400).json({ error: 'User already a member' });
    }
    await pool.query('DELETE FROM group_user WHERE id = $1', [row.id]);
    return res.json({ status: 'rejected' });
  } catch (err) {
    console.error('rejectRequest error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// getMyGroups 

export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const q = `
      SELECT g.id, g.name, g.banner_url, g.icon_url, g.created_at
      FROM groups g
      JOIN group_user gu ON gu.group_id = g.id
      WHERE gu.user_id = $1 AND gu.is_member = true
      ORDER BY g.created_at DESC
    `;
    const result = await pool.query(q, [userId]);
    return res.json({ groups: result.rows });
  } catch (err) {
    console.error('getMyGroups error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Public search -searchGroups
// groups search by name. Query param: q
export const searchGroups = async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    // searchGroups called with q
    if (!q) {
      // return recent public groups if no query
      const r = await pool.query('SELECT id, name, banner_url, icon_url, created_at FROM groups ORDER BY created_at DESC LIMIT 50');
      // returning recent groups
      return res.json({ groups: r.rows });
    }
//  Group search query
    const sql = `SELECT id, name, banner_url, icon_url, created_at
      FROM groups
      WHERE name ILIKE $1
      ORDER BY created_at DESC
      LIMIT 50`;
    const values = [`%${q}%`];
    const result = await pool.query(sql, values);
    // matched rows for q
    return res.json({ groups: result.rows });
  } catch (err) {
    console.error('searchGroups error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
