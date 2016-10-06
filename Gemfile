source 'https://rubygems.org'

group :development do

  # Sass, Compass and extensions.
  gem 'sass'                    # Sass.
  gem 'sass-globbing'           # Import Sass files based on globbing pattern.
  gem 'breakpoint'              # Manages CSS media queries.
  gem 'scss_lint'

  # Dependency to prevent polling. Setup for multiple OS environments.
  # Optionally remove the lines not specific to your OS.
  # https://github.com/guard/guard#efficient-filesystem-handling
  gem 'rb-inotify', '~> 0.9', :require => false      # Linux
  gem 'rb-fsevent', :require => false                # Mac OSX
  gem 'rb-fchange', :require => false                # Windows

end
