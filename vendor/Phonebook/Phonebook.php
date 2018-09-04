<?php
namespace Phonebook;
/*
	Phonebook model class
*/
class Phonebook {
	// Возвращает список контактов
	public function getContactList() {
		$dbh = new DBHelper();
		$pdo = $dbh->connectToDB();
	
		// Проходим по контактам
		$contacts = [];
		$stmt = $pdo->query('SELECT id, name FROM contact');
		
		while ($row = $stmt->fetch()) {
			$contacts[$row['id']] = $row;
		}
		//return $contacts;
		
		// Добавляем к ним телефоны
		$stmt = $pdo->query('SELECT id, contact_id, phone FROM phone');
		while ($row = $stmt->fetch()) {
			// Если контакта с таким id нет, значит этот телефон не привязан ни к одному контакту
			// следовательно, отображать его не следует
			if (!isset($contacts[$row['contact_id']]))
				break;
				
			// Если поле phones отсутствует или непроинициализировано в качестве массива
			if (!isset($contacts[$row['contact_id']]['phones']) || 
				!is_array($contacts[$row['contact_id']]['phones'])
			) {
				$contacts[$row['contact_id']]['phones'] = [];
			}
			
			$contacts[$row['contact_id']]['phones'][] = $row;
		}		

		return $contacts;
	}	
	
	
	// Добавляет контакт с заданными именем и телефоном
	public function addContact($name, $phone) {
		
		$dbh = new DBHelper();
		$pdo = $dbh->connectToDB();
		
		try {
			$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

				// Добавляем контакт
				$stmt = $pdo->prepare("INSERT INTO contact (name) VALUES (:name)");
				$stmt->bindParam(':name', $name);
				$res = $stmt->execute();
				$contact_id = $pdo->lastInsertId();
				
				// Если контакт успешно добавлен, добавляем телефон
				if ($res) {
					$stmt = $pdo->prepare("INSERT INTO phone (contact_id, phone) VALUES (".$contact_id.", :phone)");
					$stmt->bindParam(':phone', $phone);
					$res = $stmt->execute();
					$phone_id = $pdo->lastInsertId();
					
					//return $contact_id;
					if ($res) {
						return ['contact_id' => $contact_id, 'phone_id' => $phone_id];
					}
				}

		} catch (Exception $e) {
			$pdo->rollBack();
			throw new Exception($e->getMessage());
		}
		
		return false;
	}
	
	
	// Изменяет имя контакта
	public function updateContact($id, $name) {
		$dbh = new DBHelper();
		$pdo = $dbh->connectToDB();
	
		// Проверяем существование контакта
		$stmt = $pdo->prepare('SELECT name FROM contact WHERE id = :id');
		$stmt->bindParam(':id', $id);
		$stmt->execute();
		
		if ($row = $stmt->fetch()) {
			// Если имя меняется на такое же, то запрос не выполняем
			if ($row['name'] == $name) {
				return true;
			} else {
				// Выполняем update
				$stmt = $pdo->prepare('UPDATE contact SET name = :name WHERE id = :id');
				$stmt->bindParam(':name', $name);
				$stmt->bindParam(':id', $id);
				$stmt->execute();
				
				return true;
			}
		} else {
			return false;
		}
	}
	
	
	// Удалить контакт
	public function deleteContact($id) {
		$dbh = new DBHelper();
		$pdo = $dbh->connectToDB();
		
		$stmt = $pdo->prepare('DELETE FROM contact WHERE id = :id');
		$stmt->bindParam(':id', $id);
		$stmt->execute();
		
		$res = $stmt->rowCount();

		return $res;
	}
	
	
	// Добавить телефон к контакту
	public function addPhone($contact_id, $phone) {
		$dbh = new DBHelper();
		$pdo = $dbh->connectToDB();
		
		// Проверяем существование контакта
		$stmt = $pdo->prepare('SELECT count(*) as "count" FROM contact WHERE id = :id');
		$stmt->bindParam(':id', $contact_id);
		$stmt->execute();
		$row = $stmt->fetch();
		if ($row['count'] > 0) {
			// При наличии контакта - добавляем телефон
			$stmt = $pdo->prepare("INSERT INTO phone (contact_id, phone) VALUES (:contact_id, :phone)");
			$stmt->bindParam(':contact_id', $contact_id);
			$stmt->bindParam(':phone', $phone);
			$res = $stmt->execute();
			$phone_id = $pdo->lastInsertId();			
			
			return $phone_id;
		} else {
			return false;
		}
	}
	
	
	// Изменяет имя контакта
	public function updatePhone($id, $phone) {
		$dbh = new DBHelper();
		$pdo = $dbh->connectToDB();
	
		// Проверяем существование телефона
		$stmt = $pdo->prepare('SELECT phone FROM phone WHERE id = :id');
		$stmt->bindParam(':id', $id);
		$stmt->execute();
		
		if ($row = $stmt->fetch()) {
			// Если номер меняется на такой же, то запрос не выполняем
			if ($row['phone'] == $phone) {
				return true;
			} else {
				// Выполняем update
				$stmt = $pdo->prepare('UPDATE phone SET phone = :phone WHERE id = :id');
				$stmt->bindParam(':phone', $phone);
				$stmt->bindParam(':id', $id);
				$stmt->execute();
				
				return true;
			}
		} else {
			return false;
		}
	}	
	

	// Удалить телефон
	public function deletePhone($id) {
		$dbh = new DBHelper();
		$pdo = $dbh->connectToDB();
		
		$stmt = $pdo->prepare('DELETE FROM phone WHERE id = :id');
		$stmt->bindParam(':id', $id);
		$stmt->execute();
		
		$res = $stmt->rowCount();

		return $res;
	}
}