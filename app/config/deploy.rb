set :application, "node_stream"
set :repository,  "git@github.com:gaurishkaves/node_stream.git"
set :deploy_to, "/web/#{application}"
set :user, "root"
set :use_sudo, false
set :keep_releases, 1
set :deploy_via,  :remote_cache
set :shared_children, fetch(:shared_children, []).push('uploads','logs', 'databases','node_modules')
# set :scm, :git # You can set :scm explicitly or Capistrano will make an intelligent guess based on known version control directory names
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

#after "deploy", "deploy:restart_node"
namespace :deploy do
	task :restart_node, :roles => :web do
		run "sudo systemctl restart panel"
	end
end

role :web, "kp"                          # Your HTTP server, Apache/etc
role :app, "kp"                          # This may be the same as your `Web` server
role :db,  "kp", :primary => true # This is where Rails migrations will run
role :db,  "kp"



