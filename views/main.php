<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Phonebook</title>
	<script src="/js/jquery.min.js"></script>
	<script src="/js/phonebook.js"></script>
	<link rel="stylesheet" href="/css/phonebook.css"/>
</head>
<body>
<div class="wrap">
    <div class="container">
		<h1>Телефонный справочник</h1>
		

		<div class="screens">
			<div class="screen contacts_list">
				<div id="tools_container">
					<input type="button" value="Добавить контакт" id="add_contact" style="display: block; margin-bottom: 12px;"/>
					<input type="text" placeholder="Наименование или телефон" id="search_contact" style="width: 200px; display: inline-block;"/>
					<input type="button" value="Сброс" id="reset_search" class="btn btn-default	"/>
					<p class="hint">Введите запрос и нажмите Enter</p>
				</div>
				
				<div id="contacts_container">
					<table id="contacts_table">
						<tr>
							<th>Наименование</th>
							<th>Телефоны</th>
							<th>Действия</th>
						</tr>			
					</table>
				</div>
			</div>
			<div class="screen add_contact" style="display: none;">
				<input type="text" placeholder="Имя" id="add_contact_name" style="display: block;"/>
				<input type="text" placeholder="Телефон" id="add_contact_phone" style="display: block;"/>
				<input type="button" id="add_contact_submit" value="Добавить"/>
			</div>
			<div class="screen update_contact" id="update_contact_form_container">

			</div>
			<div class="screen add_phone" style="display: none;">
				<input type="hidden" id="add_phone_contact_id" style="display: block;"/>
				<input type="text" placeholder="Телефон" id="add_phone" style="display: block;"/>
				<input type="button" id="add_phone_submit" value="Добавить"/>
			</div>			
		</div>
    </div>
</div>

</body>
</html>