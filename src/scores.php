<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

$_POST = json_decode(file_get_contents("php://input"), true);

if (!(isset( $_POST["newScore"]))) {
  echo "score not set";
}
if (!(isset( $_POST["newName"]))) {
  echo "name not set";
}

$scoreFile = file('scores.csv');
$scores = [];
foreach ($scoreFile as $line) {
    $scores[] = str_getcsv($line);
}

$newScore = $_POST["newScore"];
$newName = $_POST["newName"];

$tempscore = null;
$tempname = null;
$highscores[] = null;
$i = 0;

$file = fopen("scores.csv", "w") or die("Unable to write file!");


foreach($scores as $value) {

  if ($newScore > $value[1]) {
    $highscore[$i][1] = $newScore;
    $highscore[$i][0] = $newName;

    $newScore = $value[1];
    $newName = $value[0];
  } else {
    $highscore[$i][1] = $value[1];
    $highscore[$i][0] = $value[0];
  }
  fwrite($file, $highscore[$i][0] . "," . $highscore[$i][1] . "\n");
  $i++;
  if ($i >= 10) {
    break;  
  }
}

if ($i < 10) {
  $highscore[$i][1] = $newScore;
  $highscore[$i][0] = $newName;
  fwrite($file, $highscore[$i][0] . "," . $highscore[$i][1]);
}

fclose($file);

$json = json_encode($highscore);

echo $json;

