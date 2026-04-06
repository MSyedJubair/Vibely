// const files = {
//   "package.json": {
//     file: {
//       contents:
//         '{   "name": "framer-motion-demo",   "private": true,   "version": "0.0.0",   "type": "module",   "scripts": {     "dev": "vite",     "build": "vite build",     "preview": "vite preview"   },   "dependencies": {     "react": "^18.2.0",     "react-dom": "^18.2.0",     "framer-motion": "^11.0.0"   },   "devDependencies": {     "vite": "^5.0.0",     "@vitejs/plugin-react": "^4.0.0"   } }',
//     },
//   },
//   "vite.config.js": {
//     file: {
//       contents:
//         "import { defineConfig } from 'vite'; import react from '@vitejs/plugin-react';  export default defineConfig({   plugins: [react()] });",
//     },
//   },
//   "index.html": {
//     file: {
//       contents:
//         '<!DOCTYPE html> <html lang="en">   <head>     <meta charset="UTF-8" />     <meta name="viewport" content="width=device-width, initial-scale=1.0" />     <title>Framer Motion Demo</title>   </head>   <body>     <div id="root"></div>     <script type="module" src="/main.jsx"></script>   </body> </html>',
//     },
//   },
//   "main.jsx": {
//     file: {
//       contents:
//         "import React from 'react'; import { createRoot } from 'react-dom/client'; import App from './App';  createRoot(document.getElementById('root')).render(   <React.StrictMode>     <App />   </React.StrictMode> );",
//     },
//   },
//   "App.jsx": {
//     file: {
//       contents:
//         "import React, { useState } from 'react'; import { motion } from 'framer-motion';  export default function App() {   const [expanded, setExpanded] = useState(false);    return (     <div style={styles.container}>       <h1>Framer Motion Demo 🚀</h1>        <motion.div         style={styles.box}         animate={{           scale: expanded ? 1.5 : 1,           rotate: expanded ? 180 : 0,           borderRadius: expanded ? '50%' : '10%'         }}         transition={{ duration: 0.6 }}       />        <button onClick={() => setExpanded(!expanded)} style={styles.button}>         Toggle Animation       </button>        <div style={styles.cardContainer}>         {[1, 2, 3].map((item) => (           <motion.div             key={item}             style={styles.card}             whileHover={{ scale: 1.1, y: -10 }}             whileTap={{ scale: 0.95 }}           >             Card {item}           </motion.div>         ))}       </div>        <div style={{ marginTop: 40 }}>         {[1, 2, 3, 4].map((item) => (           <motion.div             key={item}             initial={{ opacity: 0, y: 20 }}             animate={{ opacity: 1, y: 0 }}             transition={{ delay: item * 0.2 }}             style={styles.listItem}           >             Item {item}           </motion.div>         ))}       </div>     </div>   ); }  const styles = {   container: {     fontFamily: 'sans-serif',     textAlign: 'center',     padding: 40   },   box: {     width: 100,     height: 100,     background: 'linear-gradient(135deg, #6e8efb, #a777e3)',     margin: '20px auto'   },   button: {     padding: '10px 20px',     marginBottom: 30,     cursor: 'pointer'   },   cardContainer: {     display: 'flex',     justifyContent: 'center',     gap: 20   },   card: {     width: 100,     height: 100,     background: '#eee',     display: 'flex',     alignItems: 'center',     justifyContent: 'center',     borderRadius: 10,     cursor: 'pointer'   },   listItem: {     background: '#ddd',     margin: '10px auto',     padding: 10,     width: 200,     borderRadius: 8   } };",
//     },
//   },
// };

// const files = {
//   "App.jsx": {
//     file: {
//       contents: "source code string",
//     },
//   },
//   components: {
//     directory: {
//       "header.jsx": {
//         file: {
//           contents: "source code string",
//         },
//       },
//     },
//   },
//   "package.json": {
//     file: {
//       contents: "add dependencies and versions",
//     },
//   },
// };

// let sandpackfile = {};

// function crawlFiles(files, path = "") {
//   for (const name in files) {
//     const node = files[name];

//     if (node.directory) {
//       // go deeper into directory
//       crawlFiles(node.directory, path + name + "/");
//     } else if (node.file) {
//       // build full path
//       const fullPath = path + name;
//       sandpackfile[fullPath] = node.file.contents;
//     }
//   }
// }

// crawlFiles(files)
// console.log(sandpackfile)

function readTreeTemplate(items) {
  function buildNode(nodeId) {
    const node = items[nodeId];

    // If it's a folder → return directory
    if (node.isFolder) {
      const directory = {};

      node.children.forEach(childId => {
        const child = items[childId];

        // Use the "content" (or fallback to index) as key name
        const key = child.index.split('/').at(-1);

        directory[key] = buildNode(childId);
      });

      return { directory };
    }

    // If it's a file → return file with contents
    return {
      file: {
        contents: node.content || "",
      },
    };
  }

  const result = {};

  // Start from root level children
  items.root.children.forEach(childId => {
    const child = items[childId];
    const key = (child.index.split('/').at(-1));

    result[key] = buildNode(childId);
  });

  return result;
}

const items = {
    "items": {
        "root": {
            "index": "root",
            "canMove": true,
            "isFolder": true,
            "children": [
                "root/src",
                "root/index.html",
                "root/package.json",
                "root/postcss.config.js",
                "root/tailwind.config.js"
            ],
            "data": "root",
            "content": null
        },
        "root/src": {
            "index": "root/src",
            "canMove": true,
            "isFolder": true,
            "children": [
                "root/src/assets",
                "root/src/App.jsx",
                "root/src/main.jsx",
                "root/src/index.css",
                "root/src/components"
            ],
            "data": "src",
            "content": null
        },
        "root/src/assets": {
            "index": "root/src/assets",
            "canMove": true,
            "isFolder": true,
            "children": [
                "root/src/assets/logo.svg"
            ],
            "data": "assets",
            "content": null
        },
        "root/src/assets/logo.svg": {
            "index": "root/src/assets/logo.svg",
            "canMove": true,
            "isFolder": false,
            "children": [],
            "data": "logo.svg",
            "content": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12 2L2 7V17L12 22L22 17V7L12 2Z\" stroke=\"#1D4ED8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M7 4.5L12 7.5L17 4.5\" stroke=\"#1D4ED8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M2 7L12 12L22 7\" stroke=\"#1D4ED8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M12 22L12 12\" stroke=\"#1D4ED8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>\n"
        },
        "root/src/App.jsx": {
            "index": "root/src/App.jsx",
            "canMove": true,
            "isFolder": false,
            "children": [],
            "data": "App.jsx",
            "content": "import React from 'react';\n import Header from './components/Header';\nimport Hero from './components/Hero';\nimport FeaturedProperties from './components/FeaturedProperties';\nimport CallToAction from './components/CallToAction';\nimport Footer from './components/Footer';\n\nfunction App() {\n  return (\n    <div className=\"min-h-screen bg-white font-sans text-dark\">\n      <Header />\n      <main>\n        <Hero />\n        <FeaturedProperties />\n        <CallToAction />\n      </main>\n      <Footer />\n    </div>\n  );\n}\n\nexport default App;\n"
        },
        "root/src/main.jsx": {
            "index": "root/src/main.jsx",
            "canMove": true,
            "isFolder": false,
            "children": [],
            "data": "main.jsx",
            "content": "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App.jsx';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n"
        },
        "root/src/index.css": {
            "index": "root/src/index.css",
            "canMove": true,
            "isFolder": false,
            "children": [],
            "data": "index.css",
            "content": "@import 'tailwindcss/base';\n@import 'tailwindcss/components';\n@import 'tailwindcss/utilities';\n\n/* Optional: Add custom fonts from Google Fonts */\n@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@400;700&display=swap');\n"
        },
        "root/src/components": {
            "index": "root/src/components",
            "canMove": true,
            "isFolder": true,
            "children": [
                "root/src/components/Hero.jsx",
                "root/src/components/Footer.jsx",
                "root/src/components/Header.jsx",
                "root/src/components/CallToAction.jsx",
                "root/src/components/FeaturedProperties.jsx"
            ],
            "data": "components",
            "content": null
        },
        "root/src/components/Hero.jsx": {
            "index": "root/src/components/Hero.jsx",
            "canMove": true,
            "isFolder": false,
            "children": [],
            "data": "Hero.jsx",
            "content": "import React from 'react';\n\nconst Hero = () => {\n  return (\n    <section id=\"hero\" className=\"relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 md:py-32 lg:py-48 overflow-hidden\">\n      {/* Background shape/pattern */}\n      <div className=\"absolute inset-0 z-0 opacity-20\">\n        <svg className=\"w-full h-full\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"none\">\n          <polygon points=\"0,100 100,0 100,100\" fill=\"currentColor\" className=\"text-blue-700\" />\n          <circle cx=\"80\" cy=\"20\" r=\"15\" fill=\"currentColor\" className=\"text-blue-500\" />\n          <rect x=\"10\" y=\"70\" width=\"20\" height=\"20\" fill=\"currentColor\" className=\"text-blue-500\" />\n        </svg>\n      </div>\n\n      <div className=\"container mx-auto text-center relative z-10 px-4\">\n        <h1 className=\"text-4xl md:text-6xl font-serif font-bold leading-tight mb-6 animate-fade-in-up\">\n          Find Your <span className=\"text-secondary\">Dream Home</span> Today\n        </h1>\n        <p className=\"text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90 animate-fade-in-up delay-200\">\n          Explore thousands of properties for sale and rent. Your perfect living space is just a click away.\n        </p>\n        <div className=\"flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up delay-400\">\n          <button className=\"bg-secondary text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-600 transition duration-300 shadow-lg\">\n            Browse Properties\n          </button>\n          <button className=\"bg-white text-primary px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition duration-300 shadow-lg\">\n            Contact an Agent\n          </button>\n        </div>\n      </div>\n    </section>\n  );\n};\n\nexport default Hero;\n"
        },
        "root/src/components/Footer.jsx": {
            "index": "root/src/components/Footer.jsx",
            "canMove": true,
            "isFolder": false,
            "children": [],
            "data": "Footer.jsx",
            "content": "import React from 'react';\n\nconst Footer = () => {\n  return (\n    <footer className=\"bg-dark text-white py-12\">\n      <div className=\"container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8\">\n        <div>\n          <h3 className=\"text-xl font-bold mb-4 text-primary\">DreamHomes</h3>\n          <p className=\"text-gray-400 text-sm\">\n            Your trusted partner in finding your dream home. We make real estate dreams a reality.\n          </p>\n        </div>\n        <div>\n          <h3 className=\"text-lg font-semibold mb-4\">Quick Links</h3>\n          <ul className=\"space-y-2\">\n            <li><a href=\"#hero\" className=\"text-gray-400 hover:text-white transition duration-300\">Home</a></li>\n            <li><a href=\"#properties\" className=\"text-gray-400 hover:text-white transition duration-300\">Properties</a></li>\n            <li><a href=\"#about\" className=\"text-gray-400 hover:text-white transition duration-300\">About Us</a></li>\n            <li><a href=\"#contact\" className=\"text-gray-400 hover:text-white transition duration-300\">Contact</a></li>\n          </ul>\n        </div>\n        <div>\n          <h3 className=\"text-lg font-semibold mb-4\">Services</h3>\n          <ul className=\"space-y-2\">\n            <li><a href=\"#\" className=\"text-gray-400 hover:text-white transition duration-300\">Buy a Home</a></li>\n            <li><a href=\"#\" className=\"text-gray-400 hover:text-white transition duration-300\">Sell a Home</a></li>\n            <li><a href=\"#\" className=\"text-gray-400 hover:text-white transition duration-300\">Rent a Home</a></li>\n            <li><a href=\"#\" className=\"text-gray-400 hover:text-white transition duration-300\">Property Management</a></li>\n          </ul>\n        </div>\n        <div>\n          <h3 className=\"text-lg font-semibold mb-4\">Contact Us</h3>\n          <p className=\"text-gray-400\">123 Dream Street, Suite 456</p>\n          <p className=\"text-gray-400\">Dreamville, CA 90210</p>\n          <p className=\"text-gray-400\">Email: info@dreamhomes.com</p>\n          <p className=\"text-gray-400\">Phone: (123) 456-7890</p>\n        </div>\n      </div>\n      <div className=\"border-t border-gray-700 mt-8 pt-8 text-center\">\n        <p className=\"text-gray-500 text-sm\">&copy; {new Date().getFullYear()} DreamHomes. All rights reserved.</p>\n      </div>\n    </footer>\n  );\n};\n\nexport default Footer;\n"
        },
        "root/src/components/Header.jsx": {
            "index": "root/src/components/Header.jsx",
            "canMove": true,
            "isFolder": false,
            "children": [],
            "data": "Header.jsx",
            "content": "import React, { useState } from 'react';\nimport Logo from '../assets/logo.svg';\n\nconst Header = () => {\n  const [isOpen, setIsOpen] = useState(false);\n\n  return (\n    <header className=\"bg-white shadow-md p-4 sticky top-0 z-50\">\n      <div className=\"container mx-auto flex justify-between items-center\">\n        <div className=\"flex items-center\">\n          <img src={Logo} alt=\"Logo\" className=\"h-8 w-8 mr-2\" />\n          <span className=\"text-2xl font-bold text-primary\">DreamHomes</span>\n        </div>\n\n        <nav className=\"hidden md:flex space-x-6\">\n          <a href=\"#hero\" className=\"text-dark hover:text-primary transition duration-300\">Home</a>\n          <a href=\"#properties\" className=\"text-dark hover:text-primary transition duration-300\">Properties</a>\n          <a href=\"#about\" className=\"text-dark hover:text-primary transition duration-300\">About Us</a>\n          <a href=\"#contact\" className=\"text-dark hover:text-primary transition duration-300\">Contact</a>\n        </nav>\n\n        <div className=\"hidden md:block\">\n          <button className=\"bg-primary text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300\">\n            List Your Property\n          </button>\n        </div>\n\n        <div className=\"md:hidden\">\n          <button onClick={() => setIsOpen(!isOpen)} className=\"text-dark focus:outline-none\">\n            <svg className=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n              {isOpen ? (\n                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth=\"2\" d=\"M6 18L18 6M6 6l12 12\"></path>\n              ) : (\n                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth=\"2\" d=\"M4 6h16M4 12h16m-7 6h7\"></path>\n              )}\n            </svg>\n          </button>\n        </div>\n      </div>\n\n      {isOpen && (\n        <div className=\"md:hidden bg-white mt-4 space-y-2 p-4 border-t border-gray-200\">\n          <a href=\"#hero\" className=\"block text-dark hover:text-primary transition duration-300 py-2\">Home</a>\n          <a href=\"#properties\" className=\"block text-dark hover:text-primary transition duration-300 py-2\">Properties</a>\n          <a href=\"#about\" className=\"block text-dark hover:text-primary transition duration-300 py-2\">About Us</a>\n          <a href=\"#contact\" className=\"block text-dark hover:text-primary transition duration-300 py-2\">Contact</a>\n          <button className=\"w-full bg-primary text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300 mt-2\">\n            List Your Property\n          </button>\n        </div>\n      )}\n    </header>\n  );\n};\n\nexport default Header;\n"
        },
        "root/src/components/CallToAction.jsx": {
            "index": "root/src/components/CallToAction.jsx",
            "canMove": true,
            "isFolder": false,
            "children": [],
            "data": "CallToAction.jsx",
            "content": "import React from 'react';\n\nconst CallToAction = () => {\n  return (\n    <section className=\"bg-gradient-to-r from-blue-700 to-blue-900 py-20 text-white\">\n      <div className=\"container mx-auto text-center px-4\">\n        <h2 className=\"text-4xl font-serif font-bold mb-6\">\n          Ready to Find Your Next Home?\n        </h2>\n        <p className=\"text-lg opacity-90 max-w-3xl mx-auto mb-10\">\n          Whether you're buying, selling, or renting, our expert agents are here to help you every step of the way. Contact us today for a free consultation!\n        </p>\n        <div className=\"flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6\">\n          <button className=\"bg-secondary text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-orange-600 transition duration-300 shadow-md\">\n            Get Started\n          </button>\n          <button className=\"border border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white hover:text-primary transition duration-300 shadow-md\">\n            Learn More\n          </button>\n        </div>\n      </div>\n    </section>\n  );\n};\n\nexport default CallToAction;\n"
        },
        "root/src/components/FeaturedProperties.jsx": {
            "index": "root/src/components/FeaturedProperties.jsx",
            "canMove": true,
            "isFolder": false,
            "children": [],
            "data": "FeaturedProperties.jsx",
            "content": "import React from 'react';\n\nconst properties = [\n  {\n    id: 1,\n    image: 'https://via.placeholder.com/400x300/525252/ffffff?text=Modern+Villa',\n    title: 'Luxury Modern Villa',\n    location: 'Beverly Hills, CA',\n    price: '$2,500,000',\n    beds: 4,\n    baths: 3,\n    sqft: 3200,\n  },\n  {\n    id: 2,\n    image: 'https://via.placeholder.com/400x300/6b7280/ffffff?text=Family+House',\n    title: 'Spacious Family House',\n    location: 'Suburbia, TX',\n    price: '$450,000',\n    beds: 3,\n    baths: 2,\n    sqft: 2100,\n  },\n  {\n    id: 3,\n    image: 'https://via.placeholder.com/400x300/4b5563/ffffff?text=City+Apartment',\n    title: 'Downtown Apartment',\n    location: 'New York, NY',\n    price: '$850,000',\n    beds: 2,\n    baths: 2,\n    sqft: 1100,\n  },\n  {\n    id: 4,\n    image: 'https://via.placeholder.com/400x300/374151/ffffff?text=Beachfront+Home',\n    title: 'Beachfront Paradise',\n    location: 'Malibu, CA',\n    price: '$3,800,000',\n    beds: 5,\n    baths: 4,\n    sqft: 4500,\n  },\n  {\n    id: 5,\n    image: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Cozy+Cottage',\n    title: 'Cozy Country Cottage',\n    location: 'Rural Area, VT',\n    price: '$320,000',\n    beds: 2,\n    baths: 1,\n    sqft: 1500,\n  },\n  {\n    id: 6,\n    image: 'https://via.placeholder.com/400x300/111827/ffffff?text=Luxury+Penthouse',\n    title: 'Luxury City Penthouse',\n    location: 'Miami, FL',\n    price: '$1,200,000',\n    beds: 3,\n    baths: 3,\n    sqft: 2800,\n  },\n];\n\nconst PropertyCard = ({ property }) => (\n  <div className=\"bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group\">\n    <img \n      src={property.image} \n      alt={property.title} \n      className=\"w-full h-56 object-cover object-center transform group-hover:scale-105 transition-transform duration-500\"\n    />\n    <div className=\"p-6\">\n      <h3 className=\"text-xl font-bold text-dark mb-2\">{property.title}</h3>\n      <p className=\"text-gray-600 mb-3 flex items-center\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" className=\"h-5 w-5 mr-2 text-primary\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n          <path fillRule=\"evenodd\" d=\"M5.05 4.05A7 7 0 1110 18.15V21a1 1 0 11-2 0v-2.85a7 7 0 01-2.95-12.25zM10 11a3 3 0 100-6 3 3 0 000 6z\" clipRule=\"evenodd\" />\n        </svg>\n        {property.location}\n      </p>\n      <p className=\"text-2xl font-bold text-primary mb-4\">{property.price}</p>\n      <div className=\"flex justify-between text-gray-700 text-sm mb-4\">\n        <span className=\"flex items-center\"><i className=\"fas fa-bed mr-1 text-primary\"></i> {property.beds} Beds</span>\n        <span className=\"flex items-center\"><i className=\"fas fa-bath mr-1 text-primary\"></i> {property.baths} Baths</span>\n        <span className=\"flex items-center\"><i className=\"fas fa-ruler-combined mr-1 text-primary\"></i> {property.sqft} sqft</span>\n      </div>\n      <button className=\"w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300\">\n        View Details\n      </button>\n    </div>\n  </div>\n);\n\nconst FeaturedProperties = () => {\n  return (\n    <section id=\"properties\" className=\"py-16 bg-light\">\n      <div className=\"container mx-auto px-4\">\n        <h2 className=\"text-4xl font-serif font-bold text-center text-dark mb-12\">\n          Our Featured Properties\n        </h2>\n        <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8\">\n          {properties.map((property) => (\n            <PropertyCard key={property.id} property={property} />\n          ))}\n        </div>\n        <div className=\"text-center mt-12\">\n          <button className=\"bg-primary text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-300 shadow-md\">\n            View All Properties\n          </button>\n        </div>\n      </div>\n    </section>\n  );\n};\n\nexport default FeaturedProperties;\n"
        },
        "root/index.html": {
            "index": "root/index.html",
            "canMove": true,
            "isFolder": false,
            "children": [],
            "data": "index.html",
            "content": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/vite.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Dream Homes</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.jsx\"></script>\n  </body>\n</html>\n"
        },
        "root/package.json": {
            "index": "root/package.json",
            "canMove": true,
            "isFolder": false,
            "children": [],
            "data": "package.json",
            "content": "{\n  \"name\": \"real-estate-landing\",\n  \"private\": true,\n  \"version\": \"0.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"lint\": \"eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0\",\n    \"preview\": \"vite preview\"\n  },\n  \"dependencies\": {\n    \"react\": \"^18.2.0\",\n    \"react-dom\": \"^18.2.0\"\n  },\n  \"devDependencies\": {\n    \"@types/react\": \"^18.2.15\",\n    \"@types/react-dom\": \"^18.2.7\",\n    \"@vitejs/plugin-react\": \"^4.0.3\",\n    \"autoprefixer\": \"^10.4.16\",\n    \"eslint\": \"^8.45.0\",\n    \"eslint-plugin-react\": \"^7.32.2\",\n    \"eslint-plugin-react-hooks\": \"^4.6.0\",\n    \"eslint-plugin-react-refresh\": \"^0.4.3\",\n    \"postcss\": \"^8.4.31\",\n    \"tailwindcss\": \"^3.3.3\",\n    \"vite\": \"^4.4.5\"\n  }\n}\n"
        },
        "root/postcss.config.js": {
            "index": "root/postcss.config.js",
            "canMove": true,
            "isFolder": false,
            "children": [],
            "data": "postcss.config.js",
            "content": "export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n"
        },
        "root/tailwind.config.js": {
            "index": "root/tailwind.config.js",
            "canMove": true,
            "isFolder": false,
            "children": [],
            "data": "tailwind.config.js",
            "content": "/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [\n    \"./index.html\",\n    \"./src/**/*.{js,ts,jsx,tsx}\",\n  ],\n  theme: {\n    extend: {\n      fontFamily: {\n        sans: ['Inter', 'sans-serif'],\n        serif: ['Merriweather', 'serif'],\n      },\n      colors: {\n        primary: '#1D4ED8', // Blue\n        secondary: '#D97706', // Orange\n        dark: '#1F2937', // Dark Gray\n        light: '#F3F4F6', // Light Gray\n      }\n    },\n  },\n  plugins: [],\n};\n"
        }
    }
}

const results = readTreeTemplate(items.items)

console.log(results.src.directory)