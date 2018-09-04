<?php
namespace Phonebook;
class DBHelper {
	// PDO Instance
	private $_pdo = null;
	
	
	// Параметры подключения к БД
	private function getOptions() {
		$opts = [
			'host' => '127.0.0.1',		//  -------------------------
			'db' => 'test',				// | Опции подключения к БД  |
			'user' => 'root',			// |   При необходимости	 |
			'pass' => '',				// |       изменить!		 |
			'charset' => 'utf8',		//  -------------------------
		];
		
		$opts['dsn'] = "mysql:host=".$opts['host'].";dbname=".$opts['db'].";charset=".$opts['charset'];
		$opts['pdo_opts'] = [
			\PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
			\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
			\PDO::ATTR_EMULATE_PREPARES   => false,
		];
		
		return $opts;
	}
	
	
	// Возвращает PDO объект
	public function connectToDB() {
		if ($this->_pdo) 
			return _pdo;

		$options = $this->getOptions();
		$pdo = new \PDO($options['dsn'], $options['user'], $options['pass'], $options['pdo_opts']);
		return $pdo;
	}
}