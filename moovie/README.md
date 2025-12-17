# 🎬 Movie Project

## 📖 Overview
This project is a web application designed for movie enthusiasts. It leverages open data from **The Movie Database (TMDb)** to provide a rich collection of film-related information.  

The browser-based frontend is implemented with **React**, while the backend server is built using **Node.js** and **Express**. Data is stored in a **PostgreSQL** database.  

The goal of this project is to help users discover movies, share their interests, and connect with other film lovers by creating groups, lists, and favorites.

## 🚀 Features

1. **Responsive Design**  
   - The user interface scales smoothly when resizing the browser window and adapts to different screen sizes.  

2. **User Registration**  
   - Users can register with an email and password.  
   - Passwords must be at least 8 characters long and include one uppercase letter and one number.  

3. **User Login & Logout**  
   - Registered users can log in with their credentials.  
   - Users can securely log out at any time.  

4. **Account Deletion**  
   - Users can delete their account.  
   - All data created by the user (reviews, favorites, lists) is removed.  

5. **Movie & Series Search**  
   - Search functionality with at least three different criteria (e.g., title, genre, year).  
   - Available without login.  

6. **Now in Theaters (Finland)**  
   - Displays movies currently showing in Finnish cinemas.  
   - Available without login.  

7. **Group Pages**  
   - Users can create new groups with custom names.  
   - Groups are listed publicly, but only members can view detailed content.  
   - Group owners can delete their groups.  

8. **Add Members to Groups**  
   - Users can send join requests to groups.  
   - Group owners can approve or reject requests.  

9. **Remove Members from Groups**  
   - Group owners can remove members.  
   - Members can also leave groups voluntarily.  

10. **Group Page Customization**  
    - Group members can add movies (from search results) to the group page.  

11. **Movie Reviews**  
    - Logged-in users can post reviews with text and a star rating (1–5).  
    - Reviews display the username and timestamp.  
    - Reviews appear alongside movie details.  

12. **Browse Reviews**  
    - All users can view movie reviews.  

13. **Favorites List**  
    - Logged-in users can create a personal favorites list.  
    - Displayed on the user’s profile page.  

14. **Share Favorites List**  
    - Users can share their favorites list via a public URL.  

15. **Optional Feature (Custom)**  
    - Additional functionality such as:  
      - 🛒 Shop integration  
      - 📑 Custom lists  
      - 🎨 Background changes based on genre during search  

## ☁️ Deployment

This project is containerized with **Docker** and deployed using **[Railway](https://railway.app/)**.

### 🐳 Docker
- The application is packaged into Docker containers for consistent environments across development and production.  
- Docker ensures reproducibility and simplifies setup by bundling dependencies and configurations.  

## 🧪 Testing

The application’s REST API has been tested with automated unit tests.  
The purpose of these tests is to practice writing and running API tests, rather than covering every possible endpoint.  

### 🔍 Test Coverage
Tests include both **positive** and **negative** cases where appropriate.  
The following functionalities are tested:
- **User Registration**  
- **User Login**  
- **User Logout**  
- **Account Deletion** (including removal of user-created data)  
- **Browsing Reviews**  

## 📚 Documentation

Additional documentation is available in the GitHub repository, showcasing how the project progressed over time. The documentation includes:

- **Database Class Diagram (Luokkakaavio tietokannasta)**  
- **User Interface Design (Käyttöliittymäsuunnitelma)**  
- **REST API Documentation (REST-dokumentaatio)**  
- **Development Backlog Management (Kehitysjonon hallinta)**  
- **Version Control Practices (Versionhallinta)**  
- **Project Management (Projektin hallinta)**  

## 🌐 Live Demo
You can explore the application here: [Movie Project Web App](https://main-production-cadb.up.railway.app/)

## 👩‍💻 About the Project

This project was created as part of the course **Web-ohjelmoinnin sovellusprojekti** at Oulu University of Applied Sciences.  

It was developed collaboratively by:  
- Pilar Murcia Pozuelo  
- Yvonne Frankort  
- Petteri Pätsi  
- Markku Puutala  

We are second-year students of Information and Technology, specializing in software development.  

We were highly motivated to complete this project, and throughout the process we learned many new skills and technologies. Overall, it was a great experience that allowed us to be creative, work as a team, and grow as developers.