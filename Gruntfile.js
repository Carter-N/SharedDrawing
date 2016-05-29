//Gruntfile.js
module.exports = function(grunt){   
    
    //Task configuration
    grunt.initConfig({
        
        //Refrence to package
        pkg: grunt.file.readJSON("package.json"),
        
        //JShint configuration
        jshint: {
            options: {
                reporter: require("jshint-stylish")
            },
            
            build: ["Gruntfile.js", "public/app/*.js"]
        },
        
        //JS Minification configuration
        uglify: {
            options: {
                banner: "/*\n <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> \n*/\n"
            },
            build: {
                files: {
                    "dist/app.min.js": "public/app/*.js"
                }
            }
        },
        
        //CSS Minification configuration
        cssmin: {
            options: {
                banner: "/*\n <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> \n*/\n"
            },
            build: {
                files: {
                    'dist/style.min.css': "public/style.css"
                }
            }
        },
        
        //HTML Minification
        htmlmin: {                                  
            dist: {                                     
                options: {                               
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                 
                    "dist/index.html": "public/index.html"
                }
            }
        }
    });
    
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    
    grunt.registerTask("default", ["htmlmin", "uglify", "cssmin"]);
};