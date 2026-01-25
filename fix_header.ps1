$content = Get-Content 'c:\Users\cht31\Documents\GitHub\Stock_Company\stock-game-website\frontend-next\src\components\commons\header.tsx'
$content = $content -replace 'href="#"', 'href="/login"'
$content | Set-Content 'c:\Users\cht31\Documents\GitHub\Stock_Company\stock-game-website\frontend-next\src\components\commons\header.tsx'
