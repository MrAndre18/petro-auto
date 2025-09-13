<?php
$postData = file_get_contents("php://input");
$data = json_decode($postData, true);

if (!empty($data)) {
  $name = $data['name'];
  $email = $data['email'];
  $phone = $data['phone'];
  $comment = $data['comment'];

  $token = '8346108842:AAGLtS_U0hmMNUQsizINGnvqfOliQHIfajs';
  $chat_id = '-4800329256';
  $api_url = "https://api.telegram.org/bot$token/sendMessage";

  $message = "<b>📩 Новая заявка с сайта</b>\n\n";
  $message .= "<b>👤 Имя:</b> $name\n";
  $message .= "<b>📧 Email:</b> $email\n";
  $message .= "<b>📞 Телефон:</b> $phone\n";
  $message .= "<b>💬 Комментарий:</b>\n$comment";

  $response = file_get_contents($api_url . "?chat_id=$chat_id&parse_mode=html&text=" . urlencode($message));

  if ($response) {
    echo "Ваша заявка направлена, ожидайте звонка!";
  } else {
    echo "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.";
  }
} else {
  echo "Данные не были получены";
}
?>