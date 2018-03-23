<?php
/*
 *  CONFIGURE EVERYTHING HERE
 */

require 'IT/PHPMailer-master/PHPMailerAutoload.php';

$nome= $_POST["nome-cognome"];
$email= $_POST["email"];
// oggetto=$_POST["oggetto"];

// Indirizzo email presente nel campo DA dell'email.
$fromEmail = $email;
$fromName = $nome;
// Indirizzo email a cui arrivano le richieste del form di contatto 
$sendToEmail = 'spinlab@spintechgroup.com';
$sendToName = 'Sito Web : Cantine Briamara';

// oggetto della email
$oggetto = $_POST["oggetto"];

// nomi dei campi e le loro traduzioni.
// array di variabili nome => Testo che compare sulla email
$fields = array('nome-cognome' => 'Nome e Cognome', /*'cognome' => 'Cognome', */  'telefono' => 'Numero di telefono', 'email' => 'Email', 'oggetto' => 'Oggetto del messaggio' ,'messaggio' => 'Messaggio'); 




// messaggio che compare quando tutto è OK :)
$okMessaggio = 'Email inviata con successo!';

// Se c'è stato qualche errore viene visualizzato quaeto messaggio
$errorMessaggio = 'Errore durante invio della mail. Per favore riprova più tardi';

/*
 *  INVIO DELLA MAIL
 */

error_reporting(E_ALL & ~E_NOTICE);

try
{

$emailTextHtml = "<h1>Hai un nuovo messaggio dal form di contatto di Cantine Briamara</h1><hr>";
$emailTextHtml .= "<table>";

foreach ($_POST as $key => $value) {
    // Se il campo esiste nell'array $fields, il campo viene inserito nel corpo della email
    if (isset($fields[$key])) {
        $emailTextHtml .= "<tr><th>$fields[$key]</th><td>$value</td></tr>";
    }
}
$emailTextHtml .= "</table><hr>";
// $emailTextHtml .= "<p>Have a nice day,<br>Best,<br>Ondrej</p>";


$mail = new PHPMailer;

$mail->setFrom($fromEmail, $fromName);
$mail->addAddress($sendToEmail, $sendToName); // si possono aggiungere più mail aggiungendo una riga con $mail->addAddress();
$mail->addReplyTo($email);

$mail->isHTML(true);

$mail->Subject = $oggetto;
$mail->msgHTML($emailTextHtml); // this will also create a plain-text version of the HTML email, very handy

if(!$mail->send()) {
    throw new \Exception('Non posso inviare la mail.' . $mail->ErrorInfo);
}

$responseArray = array('type' => 'success', 'message' => $okMessaggio);
}
catch (\Exception $e)
{
    $responseArray = array('type' => 'danger', 'message' => $errorMessaggio);
}



// se richiesto da AJAX ritorna la risposta JSON 
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    $encoded = json_encode($responseArray);

    header('Content-Type: application/json');

    echo $encoded;
}
// altrimenti visualizza il messaggio
else {
    echo $responseArray['message'];
}


// if ($responseArray['type'] == 'success') {
//     // success redirect

//     header('Location: http://baby-moto:8888/src/IT/index');
// }
// else {
//     //error redirect
//     header('Location: http://baby-moto:8888/src/IT/balance-bike');
// }
