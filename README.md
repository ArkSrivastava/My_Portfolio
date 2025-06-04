# My Portfolio Website

A modern, interactive 3D portfolio website for a Computer Science student and Web Developer. This portfolio showcases skills, projects, and contact information with an immersive 3D background created using Three.js.

## Features

- Interactive 3D particle background using Three.js
- Responsive design that works on all devices
- Modern UI with smooth animations and transitions
- Single-page application with section navigation
- Project filtering functionality
- Contact form
- Skills visualization
- Loading screen animation

## Technologies Used

- HTML5
- CSS3 (with modern features like CSS Grid, Flexbox, and Variables)
- JavaScript (ES6+)
- Three.js for 3D graphics
- Font Awesome for icons
- Google Fonts

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript if you want to customize

### Installation

1. Clone or download this repository
2. Open the `index.html` file in your browser to view the website locally

### Customization

#### Personal Information

Edit the `index.html` file to replace placeholder text with your personal information:

- Your name (replace `[Your Name]`)
- Your email (replace `[your.email@example.com]`)
- Your location (replace `[Your City, Country]`)
- Your education details (replace `[University Name]`)
- Your social media links (replace `yourusername` in the href attributes)
- Your about me text
- Your skills and their proficiency levels

#### Profile Picture

1. Replace the placeholder image at `img/profile.jpg` with your own profile picture
2. Make sure your image is square (1:1 aspect ratio) for best results

#### Project Images

1. Replace the placeholder images at `img/project1.jpg`, `img/project2.jpg`, etc. with screenshots of your projects
2. Update the project titles, descriptions, and technologies used in the HTML
3. Add links to your live projects and GitHub repositories

#### Resume

Replace the placeholder `resume.pdf` file with your actual resume.

#### Colors

You can customize the color scheme by editing the CSS variables in the `:root` selector in `css/style.css`:

```css
:root {
    --primary-color: #6c63ff;
    --secondary-color: #4d44d9;
    --accent-color: #00c9ff;
    --background-color: #0a0a1a;
    --surface-color: #13132a;
    --text-color: #ffffff;
    --text-secondary: #b3b3cc;
    /* ... other variables ... */
}
```

## 3D Background Customization

You can customize the 3D particle background by editing the `initThreeJS()` function in `js/main.js`:

- Change the number of particles by modifying the `particlesCount` variable
- Adjust particle colors by modifying the color values in the loop
- Change particle size by modifying the `size` property in the `particlesMaterial`
- Adjust animation speed by changing the rotation increment values

## Contact Form

The contact form in this demo doesn't actually send emails. To make it functional, you'll need to:

1. Set up a backend service to handle form submissions (e.g., PHP, Node.js, or a form service like Formspree)
2. Update the form action and method attributes
3. Modify the `initContactForm()` function in `js/main.js` to handle the form submission properly

## Browser Support

This website works in all modern browsers that support WebGL (required for Three.js):

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

Feel free to use this template for your personal portfolio.

## Acknowledgments

- Three.js for the 3D graphics library
- Font Awesome for the icons
- Google Fonts for the typography
