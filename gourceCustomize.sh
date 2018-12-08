# Setup Project Name
projName="BlackOut - Source Code"

function fix {
  sed -i -- "s/$1/$2/g" gourceLog.txt
}

# Replace non human readable names with proper ones
fix "|Berrier|" "|Seth Berrier|"
fix "|WitheredEnd|" "|Kari Holmstadt|"
fix "|Bryant|" "|Justin Bryant|"
fix "|KnightlySeraph|" "|Justin Bryant|"
