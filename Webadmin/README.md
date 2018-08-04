# Setting up TimeSheet in Development

Install Java 1.8.

Install SourceTree for github repo access.

Install Node.js from the Node.js website. This will also install npm, which is the node package manager we are using in the next commands.

Install Yeoman: npm install -g yo

Install Bower: npm install -g bower

Install Grunt using npm install -g grunt-cli

Clone the remote repository to the workspace

Execute the following gradle wrapper command from the command prompt

(Follow the convention for windows / linux)
 
	./gradlew

The application runs using embedded tomcat server provided by spring-boot. 

Access the application using

	http://localhost:8088

# CSS and Javascript

Bower is used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in `bower.json`. You can also run `bower update` and `bower install` to manage dependencies.
Add the `-h` flag on any command to see how you can use it. For example, `bower update -h`.

# Building for production

To optimize the TimeSheet client for production, run:

    ./gradlew -Pprod clean bootRepackage

This will concatenate and minify CSS and JavaScript files. It will also modify `index.html` so it references
these new files.

To ensure everything worked, run:

    java -jar build/libs/*.war --spring.profiles.active=prod

Then navigate to [http://localhost:8080](http://localhost:8088) in your browser.

# Testing

Unit tests are run by [Karma][] and written with [Jasmine][]. They're located in `src/test/javascript` and can be run with:

    grunt test


