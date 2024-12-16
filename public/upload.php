<?php
// Передбачуваний список дозволених токенів (наприклад, можна витягувати з бази даних)
$allowedTokens = ['ABC123', 'XYZ789', 'TOKEN456'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Перевіряємо, чи токен переданий
    if (!isset($_POST['token']) || empty($_POST['token'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing token']);
        exit;
    }

    $token = $_POST['token'];

    // Перевіряємо, чи токен є валідним
    if (!in_array($token, $allowedTokens)) {
        http_response_code(403);
        echo json_encode(['message' => 'Invalid token']);
        exit;
    }

    // Обробка файлу
    if (isset($_FILES['file'])) {
        $uploadDir = 'images/tv/';
        
        // Створюємо директорію, якщо вона не існує
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileExtension = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        $maxFileSize = 5 * 1024 * 1024; // 5 MB

        // Перевіряємо тип файлу
        if (!in_array($fileExtension, $allowedExtensions)) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid file type']);
            exit;
        }

        // Перевіряємо розмір файлу
        if ($_FILES['file']['size'] > $maxFileSize) {
            http_response_code(400);
            echo json_encode(['message' => 'File size exceeds the limit of 5 MB']);
            exit;
        }

        // Обробка помилок завантаження
        if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['message' => 'File upload error', 'error' => $_FILES['file']['error']]);
            exit;
        }

        // Унікальне ім'я для файлу
        $uniqueName = uniqid() . '.' . $fileExtension;
        $uploadFile = $uploadDir . $uniqueName;

        // Переміщуємо файл
        if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
            echo json_encode([
                'message' => 'File uploaded successfully',
                'file' => $uploadFile,
                'token' => $token // Повертаємо токен у відповіді
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to move uploaded file']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'No file uploaded']);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>
