<?php 
namespace Phonebook;

class Controller {

	// Доступные действия
	private $_actions = [
		'list',
		'add_contact',
		'update_contact',
		'delete_contact',
		'add_phone',
		'update_phone',
		'delete_phone',
		'index'
	];
	
	private $_defaultAction = 'index';
	
	public function run() {
		$action = isset($_GET['action']) && !empty($_GET['action']) ? $_GET['action'] : $this->_defaultAction;
	
		if (!empty($action) && in_array($action, $this->_actions)) {
			
			$phonebook = new Phonebook();
			
			switch($action) {
				// Список пользователей
				case "list":
					try {
						$list = $phonebook->getContactList();
					} catch(Exception $e) {
						echo json_encode(['result' => 'error', 'text' => $e->getMessage()]);
					}
					
					echo json_encode(['result' => 'success', 'data' => $list]);
				break;
				
				// Добавить контакт
				case "add_contact":
					try  {
						if (isset($_GET['name']) && isset($_GET['phone']) && $_GET['name'] && $_GET['phone']) {
							try {
								//$contact_id = $phonebook->addContact($_GET['name'], $_GET['phone']);
								$res = $phonebook->addContact($_GET['name'], $_GET['phone']);
								//if (!$contact_id) {
								if (!$res) {
									echo json_encode(['result' => 'error', 'text' => 'Не удалось добавить контакт!']);
								}
							} catch(Exception $e) {
								echo json_encode(['result' => 'error', 'text' => $e->getMessage()]);
							}

							echo json_encode(['result' => 'success', 'contact_id' => $res['contact_id'], 'phone_id' => $res['phone_id']]);
						} else {
							echo json_encode(['result' => 'error', 'text' => 'Не указано имя и/или телефон!']);
						}
					} catch(Exception $e) {
						echo json_encode(['result' => 'error', 'text' => $e->getMessage()]);
					}
				break;
				
				// Отредактировать контакт (сменить имя)
				case "update_contact":
					if (isset($_GET['contact_id']) && isset($_GET['name']) && ($_GET['contact_id'] > 0) && $_GET['name']) {
						try {
							$update_res = $phonebook->updateContact($_GET['contact_id'], $_GET['name']);
							if (!$update_res) {
								echo json_encode(['result' => 'error', 'text' => 'Не удалось отредактировать контакт!']);	
							} else {
								echo json_encode(['result' => 'success']);
							}
						} catch(Exception $e) {
							echo json_encode(['result' => 'error', 'text' => $e->getMessage()]);
						}
					} else {
						echo json_encode(['result' => 'error', 'text' => 'Не задан ID контакта и/или имя контакта!']);	
					}
				break;
				
				// Отредактировать телефон (сменить номер)
				case "update_phone":
					if (isset($_GET['phone_id']) && isset($_GET['phone']) && ($_GET['phone_id'] > 0) && $_GET['phone']) {
						try {
							$update_res = $phonebook->updatePhone($_GET['phone_id'], $_GET['phone']);
							if (!$update_res) {
								echo json_encode(['result' => 'error', 'text' => 'Не удалось отредактировать телефон!']);	
							} else {
								echo json_encode(['result' => 'success']);
							}
						} catch(Exception $e) {
							echo json_encode(['result' => 'error', 'text' => $e->getMessage()]);
						}
					} else {
						echo json_encode(['result' => 'error', 'text' => 'Не задан ID телефона и/или номер телефона!']);	
					}
				break;				
				
				// Удалить контакт
				case "delete_contact":
					if (isset($_GET['contact_id']) && ($_GET['contact_id'] > 0)) {
						try {
							$delete_res = $phonebook->deleteContact($_GET['contact_id']);
							if (!$delete_res) {
								echo json_encode(['result' => 'error', 'text' => 'Не удалось удалить контакт!']);	
							} else {
								echo json_encode(['result' => 'success']);
							}
						} catch(Exception $e) {
							echo json_encode(['result' => 'error', 'text' => $e->getMessage()]);
						}
					} else {
						echo json_encode(['result' => 'error', 'text' => 'Не задан ID контакта!']);	
					}
				break;
				
				// Добавить телефон
				case "add_phone":
					if (isset($_GET['contact_id']) && ($_GET['contact_id'] > 0) && isset($_GET['phone']) && $_GET['phone']) {
						try {
							$addphone_res = $phonebook->addPhone($_GET['contact_id'], $_GET['phone']);
							if (!$addphone_res) {
								echo json_encode(['result' => 'error', 'text' => 'Не удалось добавить телефон!']);	
							} else {
								echo json_encode(['result' => 'success', 'phone_id' => $addphone_res]);
							}
						} catch(Exception $e) {
							echo json_encode(['result' => 'error', 'text' => $e->getMessage()]);
						}
					} else {
						echo json_encode(['result' => 'error', 'text' => 'Не задан ID контакта и/или телефон!']);	
					}					
				break;
				
				// Удалить телефон
				case "delete_phone":
					if (isset($_GET['phone_id']) && ($_GET['phone_id'] > 0)) {
						try {
							$delete_res = $phonebook->deletePhone($_GET['phone_id']);
							if (!$delete_res) {
								echo json_encode(['result' => 'error', 'text' => 'Не удалось удалить телефон!']);	
							} else {
								echo json_encode(['result' => 'success']);
							}
						} catch(Exception $e) {
							echo json_encode(['result' => 'error', 'text' => $e->getMessage()]);
						}
					} else {
						echo json_encode(['result' => 'error', 'text' => 'Не задан ID контакта!']);	
					}
				break;
				
				case "index":
					echo file_get_contents('views/main.php');
				break;
			}
		} else {
			http_response_code(404);
			echo 'Ошибка 404. Страница не найдена!';
			die();
		}
	}
}