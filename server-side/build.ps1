function init {
    Write-Output 'Building server-side...'
}

function run_git {
    git add .
    git status
    git commit -m "New Build"
    git push
}

function run_pyinstaller {
    pyinstaller ./main.py --distpath ../server-side-build --clean --name collab-server --onefile --add-data './application;application'
}


init
run_git
run_pyinstaller

Start-Process -WindowStyle Hidden ../server-side-build/collab-server.exe