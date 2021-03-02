

$server_app_name = 'application'
$build_path = $server_app_name + '/build'

function run_electron_builder {
    electron-builder --config electron-builder.yml
}





Stop-Process -Name $server_app_name 
Remove-Hard dist
Remove-Hard dist
Remove-Hard $build_path
Remove-Hard $build_path
Set-Location $server_app_name
./build.ps1
Set-Location ..
run_electron_builder
Start-Process ./dist/electron/*.exe