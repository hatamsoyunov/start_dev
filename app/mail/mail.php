<?
$result = [ 'status' => 'error' ];
$_SERVER['REQUEST_METHOD'] === 'POST' && !empty( $_POST['data'] ) ?: die( json_encode( $result ) );

$data = [
	'to'           => 'mail@domain.ru',
	'from'         => 'no-reply@domain.ru',
	'subject'      => 'Новая заявка',
	'project_name' => 'Project name',
	'fields'       => $_POST['data']
];


if( !empty( $_POST["captcha"] ) ){

	$url  = 'https://www.google.com/recaptcha/api/siteverify?secret=[key]&response=' . $_POST["captcha"]["key"] . '&remoteip=' . $_SERVER['REMOTE_ADDR'];
	$resp = json_decode( file_get_contents( $url ), true );

	if( ! empty( $resp['success'] ) && $resp['success'] == true ){
		if( sendMail( $data ) ){
			$result['status'] = 'success';
			die( json_encode( $result ) );
		} else {
			$result['status'] = 'errors';
			die( json_encode( $result ) );
		}
	} else {
		$result['status'] = 'error_recaptcha';
		die( json_encode( $result ) );
	}

} else {
	if( sendMail( $data ) ){
		$result['status'] = 'success';
		die( json_encode( $result ) );
	} else {
		$result['status'] = 'errors';
		die( json_encode( $result ) );
	}
}

function validateData( $var ){
	if( is_int( $var ) || is_float( $var ) ){
		return $var;
	} else if( is_string( $var ) ){
		if( filter_var( $var, FILTER_VALIDATE_EMAIL ) ){
			return $var;
		} else {
			return htmlspecialchars( $var );
		}
	} else {
		return false;
	}
}

function sendMail( $data ){
	$subject = empty( $_POST['subject'] ) ? $data['subject'] : htmlspecialchars( $_POST['subject']['value'] );
	$style   = 'padding: 10px; border: #e9e9e9 1px solid;';
	$message = '<table style="width: 100%;">';
	$i = 0;
	foreach( $data['fields'] as $value ){
		$message .= ( $i % 2 ) == 1 ? '<tr>' : '<tr style="background-color: #f8f8f8;">';
		$message .= '<td style=\'' . $style . '\'><b>' . validateData( $value['title'] ) . '</b></td>
						<td style=\'' . $style . '\'>' . validateData( $value['value'] ) . '</td>
					 </tr>';
		$i ++;
	}
	$message .= '</table>';
	$headers[] = 'MIME-Version: 1.0';
	$headers[] = 'Content-type: text/html; charset=utf-8';
	$headers[] = 'From: ' . $data['project_name'] . ' <' . $data['from'] . '>';
	$headers[] = 'Cc: ' . $data['from'];
	$headers[] = 'Bcc: ' . $data['from'];
	return mail( $data['to'], $subject, $message, implode( PHP_EOL, $headers ) );
}