function run_pyinstaller {
    pyinstaller ./app.py --distpath ../dist --noconfirm --name application --add-data './templates;./templates' --add-data './static;./static'
    Start-Process C:\Users\ajackson\Dropbox\Path\design-collab-search\dist\application\application.exe
}

function run_electron_builder {
    electron-builder --config electron-builder.yml
}

Write-Output '[PHASE 1] Building server-side with pyinstaller'
run_pyinstaller
Write-Output '[PHASE 2] Building client-side with electron-builder'
# run_electron_builder