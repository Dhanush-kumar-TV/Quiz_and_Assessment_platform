$env:Path += ";$PWD\node_modules\.bin"
$nextPath = ".\node_modules\next\dist\bin\next"

if (Test-Path $nextPath) {
    node $nextPath dev
} else {
    Write-Host "Next.js binary not found. Attempting to run via npx..."
    # Quote the path to handle spaces/ampersands
    $projectPath = Get-Location
    $env:INIT_CWD = $projectPath
    npx next dev
}
