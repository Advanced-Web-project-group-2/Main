# 🎬 Moo-viestar - User Flow Diagram


## 1️⃣ Authentication Flow

### 🔐 Sign In
User enters email and password credentials for login authentication. 

| Step | Description |
|------|-------------|
| 1 | User enters email/password |
| 2 | System validates credentials |
| 3 | Sets authentication token |
| 4 | Redirects to Main (Home) Page |

**Sign In Page:**
![Sign In Page](./Site%20pictures/Sign%20in/Sign%20in.jpg)

**Validation Errors:**
| Error State | Screenshot |
|---|---|
| Email not filled | ![Sign In - Email not filled](./Site%20pictures/Sign%20in/Sign%20in%20-%20Email%20not%20filled.jpg) |
| Invalid credentials | ![Sign In - Invalid Credentials](./Site%20pictures/Sign%20in/Sign%20in%20-%20Password%20or%20email%20wrong.jpg) |

---

### 📝 Sign Up
User creates a new account with email and password. Password needs to have atleast one capital letter and to be atleast 8 digits long.

| Step | Description |
|------|-------------|
| 1 | User enters email and password |
| 2 | Password must meet security requirements |
| 3 | Confirms account creation |
| 4 | Redirects to SignIn Page |

**Sign Up Page:**
![Sign Up Page](./Site%20pictures/Sign%20up/Create%20an%20account.jpg)

**Password Requirements not met:**
![Password Requirements Error](./Site%20pictures/Sign%20up/Create%20account%20-%20Password%20not%20meeting%20requirements.jpg)

## 2️⃣ Main Navigation Hub

### 🏠 Home Page
The central hub where users start. Displays top movies and access to all main features.

| Feature | Destination |
|---------|-------------|
| Top Five Movies | Click to view Movie Details |
| 🎬 In Cinemas | Browse currently playing movies |
| 🔍 Advanced Search | Filter movies by genre, rating, etc. |
| 👥 Groups | Create, manage and join movie groups |
| 🛍️ Shop | Browse and purchase user icons and accessories |
| 👤 Profile | Manage account settings and own movie lists|

**Home Page (Not logged in):**
![Home Page (User not logged in)](./Site%20pictures/Home%20page/Home%20page.jpg)

**Logged In View:**
![Home Page](./Site%20pictures/Home%20page/Home%20page%20-%20successful%20login.jpg)

## 3️⃣ Movie Discovery Paths

### 🎬 In Cinemas
Browse movies currently playing in theaters.

| Action | Result |
|--------|--------|
| View movie | Displays movie details |
| Add to favorites | Confirms addition to personal favorites |
| Share link | Copies link to clipboard |
| Add to group/list | Opens popup to select destination |

**In Cinemas:**
![In Cinemas](./Site%20pictures/In%20cinemas/Now%20in%20cinemas.jpg)

**User Actions:**
| Action | Screenshot |
|--------|-----------|
| Added to Favorites | ![Added to Favorites](./Site%20pictures/In%20cinemas/added%20to%20personal%20favorites.jpg) |
| Share Link | ![Share Link](./Site%20pictures/In%20cinemas/link%20copied.jpg) |
| Add to Groups/Lists | ![Add to Groups/Lists](./Site%20pictures/In%20cinemas/popup%20to%20add%20movies%20to%20groups%20or%20lists.jpg) |

---

### 🔍 Advanced Search
Filter movies by multiple criteria (genre, rating, release date, etc.).

| Step | Description |
|------|-------------|
| 1 | Select filters (genre, year, rating) |
| 2 | System filters movie database |
| 3 | Displays filtered results |
| 4 | Search by genre -> Change background |
| 5 | Click movie → Movie Details Page |

**Site View:**
![Advanced Search - No search](./Site%20pictures/Advanced%20search/Advanced%20search.jpg)

**Filter Example - Animation:**
![Advanced Search](./Site%20pictures/Advanced%20search/advanced%20searchThriller.jpg)


**Filter Example - Thriller:**
![Advanced Search - Thriller Genre](./Site%20pictures/Advanced%20search/Advanced%20search%20-%20Thriller.jpg)

## 4️⃣ Movie Details & Reviews

### 🎥 Movie Details Page
View complete information about a movie with the ability to interact (review, rate, add to lists, like or dislike comments).

| Feature | Description |
|---------|-------------|
| Movie Info | Title, plot, cast, runtime, rating |
| Reviews | View and write reviews |
| Like | Add to favorites |
| Add to Lists | Save to personal collection |
| Share | Copy link to share |
| Rate comments | 👍 / 👎 |

**Movie Details:**
![Movie Details](./Site%20pictures/Movie%20details%20and%20review/movie%20details.jpg)

**User Interactions:**
| Action | Screenshot |
|--------|-----------|
| Add to Lists | ![Add to Lists](./Site%20pictures/Movie%20details%20and%20review/add%20to%20lists.jpg) |
| Review & Like | ![User Review and Like](./Site%20pictures/Movie%20details%20and%20review/user%20review%20and%20like.jpg) |

## 5️⃣ Lists Management
Personal collections of favorite movies.

| Feature | Description |
|---------|-------------|
| View Lists | Display all personal movie lists |
| Create List | Add new custom list |
| Add Movies | Add personal favorites to display |
| Remove Movies | Delete movies from favorite list |
| Share | Share your Personal favorites and custom lists to others |

**Examples:**
| View | Screenshot |
|------|-----------|
| Add To Lists Popup | ![Add to Lists](<./Site pictures/Movie details and review/add to lists.jpg>) |
| Custom List | ![Users Custom List](<./Site pictures/Profile page/users custom list.jpg>) |
| Personal Favorites | ![Custom Movie List](<./Site pictures/Profile page/shared movie list.jpg>) |


---

## 6️⃣ Groups Management

### 👥 Groups Hub
Create, join and manage movie groups.

| Group Type | Features |
|-----------|----------|
| Personal Group | Full edit permissions, user-owned |
| Shared Group | Collaborative, joined by invitation |

**Groups Overview when user is not logged in:**
![Groups - Not Logged In](./Site%20pictures/Groups%20tab/Available%20groups%20not%20logged%20in.jpg)

**Logged In User without groups they are part of:**
![Logged In User](./Site%20pictures/Groups%20tab/Logged%20in%20user.jpg)

---

### ➕ Create a Group
Create a new group for movie community.

| Step | Description |
|------|-------------|
| 1 | Click "Create Group" |
| 2 | Enter group name |
| 3 | Group description (optional) |
| 4 | Group created successfully |

**Create Group Page:**
![Create a Group](./Site%20pictures/Groups%20tab/create%20a%20group.jpg)

**Missing a Group name:**
![Group Name Missing Error](./Site%20pictures/Groups%20tab/group%20name%20missing.jpg)

**Group created:**
![New Group Created](./Site%20pictures/Groups%20tab/GroupCreated.jpg)


---

### 📋 Group Management


**Group view before applying:**
![Locked Group](./Site%20pictures/Groups%20tab/locked%20group.jpg)

**Pending Request:**
![Pending Request](./Site%20pictures/Groups%20tab/pending%20request.jpg)

**Member View in Group:**
![Member View in Group](./Site%20pictures/Groups%20tab/member%20view%20in%20group.jpg)

**Empty Group (Admin):**
![Empty Group Page](./Site%20pictures/Groups%20tab/empty%20group%20page.jpg)

**Active Group (Admin view):**
![Working Group Page](./Site%20pictures/Groups%20tab/working%20group%20page.jpg)

**Delete Group (Admin):**
![Group Delete](./Site%20pictures/Groups%20tab/Group%20delete.jpg)

## 7️⃣ Shopping Feature

### 🛍️ Shop
Browse and purchase new user icons and cosmetics

| Category | Items |
|----------|-------|
| Avatars | Profile pictures |
| Accessories | Cosmetics to use on Profile |
| Credits | Earned credits by interacting in Website |

**Shop Page:**
| View | Screenshot |
|------|-----------|
| Shop Main | ![Shop Page](./Site%20pictures/Shopping%20page/shop.jpg) |
| Shop View 2 | ![Shop Page 2](./Site%20pictures/Shopping%20page/shop%202.jpg) |
| Not Logged In | ![Shop When Not Logged In](./Site%20pictures/Shopping%20page/Shop%20when%20not%20logged%20in.jpg) |

**Purchase Confirmation:**
![Avatar Bought](./Site%20pictures/Shopping%20page/avatar%20bought.jpg)

## 8️⃣ User Profile Management

### 👤 Profile Hub
Manage personal account, settings, and shared content.

| Feature | Description |
|---------|-------------|
| Profile Info | Username, credits, avatars |
| Favorite List | View personal favorite movies |
| Custom Lists | Public favorites shared with others |

**Profile Page:**
![Profile Page](./Site%20pictures/Profile%20page/profile.jpg)

**Profile Content:**
| Item | Screenshot |
|------|-----------|
| Custom Lists | ![User Custom List](./Site%20pictures/Profile%20page/users%20custom%20list.jpg) |

---

### 🔐 Account Security

#### Change Password
Update your account password.

| Step | Description |
|------|-------------|
| 1 | Enter current password |
| 2 | Enter new password |
| 3 | Confirm new password |
| 4 | Password updated successfully |

**Validation & Confirmation:**
| State | Screenshot |
|-------|-----------|
| Missing Fields | ![Missing Passwords](./Site%20pictures/Profile%20page/Change%20password%20&%20delete%20user/missing%20passwords.jpg) |
| Success | ![Password Changed Success](./Site%20pictures/Profile%20page/Change%20password%20&%20delete%20user/password%20changed.jpg) |

#### Delete Account
Permanently remove your account and all data.

| Warning | Description |
|---------|-------------|
| ⚠️ Permanent | Cannot be undone |
| 🗑️ Data Loss | All personal data will be deleted |
| 🔓 Verification | Requires current password |

**Password required to confirm account delete:**
![Delete User](./Site%20pictures/Profile%20page/Change%20password%20&%20delete%20user/delete%20user.jpg)

**Password don't match:**
![Wrong Password on Delete](./Site%20pictures/Profile%20page/Change%20password%20&%20delete%20user/wrong%20password%20on%20delete.jpg)

**Account successfully deleted:**
![Account Deleted](./Site%20pictures/Profile%20page/accountDeleted.jpg)


## 9️⃣ Public Sharing

### 🌍 PublicFavourites
View and share your favorite movies with other users.

| Action | Result |
|--------|--------|
| View Favorites | See your saved favorites |
| Share | Other users can view your list |

**Shared Movies View:** ![Shared Movie List](./Site%20pictures/Profile%20page/shared%20movie%20list.jpg)

**Share Link View:** ![Link Copied in Profile](./Site%20pictures/Profile%20page/link%20copied%20in%20profile.jpg)

---

## 🔄 Complete User Journey

```
START
  ↓
┌─────────────────────────────────────────┐
│  1️⃣ AUTHENTICATION                      │
│  Sign Up / Sign In                      │
│  (Email & Password Verification)        │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│  2️⃣ HOME PAGE (Main Hub)                │
│  Access to all features                 │
└─────────────────────────────────────────┘
  ↓
  ├─→ 🎬 IN CINEMAS
  │    ├─ View playing movies
  │    ├─ Add to favorites
  │    └─ Add to lists/groups
  │
  ├─→ 🔍 ADVANCED SEARCH
  │    ├─ Filters
  │    └─ View results
  │
  ├─→ 👥 GROUPS
  │    ├─ Create group
  │    ├─ Send a join request
  │    └─ Share lists
  │
  ├─→ 🛍️ SHOP
  │    ├─ Browse icons and accessories
  │    └─ Purchase
  │
  └─→ 👤 PROFILE
       ├─ View favorites
       ├─ Manage custom lists
       ├─ Change password
       ├─ Change user icon
       └─ Delete account
       
  ↓ (Clicking on movie poster)
┌─────────────────────────────────────────┐
│  🎥 MOVIE DETAILS                       │
│  ├─ Write review                        │
│  ├─ Like/favorite                       │
│  └─ Add to lists                        │
└─────────────────────────────────────────┘
  ↓
END (or continue exploring)
```

---

## 📊 Feature Navigation Matrix

| From | To | Action |
|------|-----|--------|
| Home | In Cinemas | Browse movies |
| Home | Advanced Search | Filter movies |
| Home | Groups | Manage groups |
| Home | Shop | Purchase items |
| Home | Profile | Account settings |
| Movie Details | Lists | Add to collection |
| Movie Details | Groups | Share with group |
| Profile | Favorites | View saved movies |
| Groups | Members | Manage members |
| Groups | Shared Lists | View group movies |

---

## ✨ Key Features Summary

- **🔐 Authentication** - Secure sign in/up with validation
- **🎬 Movie Discovery** - Browse, search, and filter movies
- **💬 Community** - Create groups and share favourite movies to group members
- **📋 Organization** - Custom lists and collections
- **🛍️ Shopping** - Purchase avatars and accessories
- **👤 Personalization** - Profile and preference management
- **🔗 Sharing** - Share custom lists and personal favorites with others

