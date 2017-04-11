# HOW TO COMPILE SASS PARTIALS TO CSS

## Pre-Requisite

**Install Compass**

* `sudo apt-get install ruby-full`
* `sudo gem install sass compass sass-globbing`

Once you finally have the Compass setup completed, you may now run these command

* `compass compile`
Run the compiler and build the styles.css, found in /<root>/assets/css
* `compass watch`
Keep compiling and watch any changes made on Sass partial files (.scss). Whenever you add
a new style partial, it should be picked up automatically since we have sass-globbing plugin

These two command should only be run, inside `/style_partials`

