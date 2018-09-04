// Телефонный номер контакта
class Phone {
	constructor(contact, id) {	
		this.id = id;
		this.number = "";
		this.contact = contact;
	}
	
	// Сменить наименование контакта
	changeNumber(newNumber) {
		this.number = newNumber;
	}	
}


// Контакт телефонной книги
class Contact {
	constructor(id) {	
		this.id = id;
		this.name = "";
		this.phones = [];
	}

	// Сменить наименование контакта
	changeName(newName) {
		this.name = newName;
	}
	
	// Добавить номер телефона
	addPhone(newPhone) {
		if (newPhone instanceof Phone) {
			this.phones.push(newPhone);
		} else {
			alert("Добавляемый номер не является номером телефона");
		}
	}
	
	
	deletePhone(id) {
		// Ищем телефон по id
		let findedPhone = this.phones.find(x => x.id == id);
		if (findedPhone instanceof Phone) {
			let indx = this.phones.indexOf(findedPhone);
			
			if (indx > -1) {
				this.phones.splice(indx, 1);
				return true;
			}
		}
		
		return false;
	}
}

class App {
	constructor() {
		// Телефонная книга
		this.contactList = [];
		this.reloadContactList();		
	}

	
	// Добавляет контакт в массив контактов
	addContact(contact) {
		let _app = this;
	
		// Добавляем в модель
		if (contact instanceof Contact) {
			this.contactList.push(contact);
		}
		
		// Добавляем в представление
			let _tr = $('<tr>');
			let _td = $('<td>');
			
			_tr.append($('<td>')
				.append($('<div>', { 
					text: contact.name,
					'data-id': contact.id,
					 class: "contact_name",
				}))
			);
			
			let _div_contact_phones = $('<div>', { 
				class: "contact_phones",
				'data-contactid': contact.id,
			});
			
			// Добавляем телефоны
			for(let phone_key in contact.phones) {
				let _div_contact_phones_container = $('<div>', { 
					class: "contact_phone_container",
					'data-contactid': contact.id,
					'data-phoneid': contact.phones[phone_key].id,
				});
				
				let _div_contact_phone = $('<div>', { 
					text: contact.phones[phone_key].number,
					class: "contact_phone",
					'data-contactid': contact.id,
					'data-phoneid': contact.phones[phone_key].id,
				});
				
				let _div_delete_phone = $('<div>', {
					text: "x",
					class: "contact_phone_delete",
					'data-contactid': contact.id,
					'data-phoneid': contact.phones[phone_key].id,
					click: function() {
						if (!confirm("Вы действительно хотите удалить этот телефон?"))
							return;
							
						let _this = $(this);
						let phone_id = _this.data('phoneid');

						$.get("/", { action: "delete_phone", phone_id: phone_id}, function( response ) {	
							let responseObj = undefined;
							try {
								responseObj = JSON.parse(response);
							} catch (e) {
								alert('Не удалось удалить телефон!');
								console.log(e);
								return;
							}
						
							if (responseObj && responseObj.result && responseObj.result == 'success') {
								// Удаляем из модели
								let findedContact = (_app.contactList.find(x => x.id == contact.id));
								if (findedContact instanceof Contact) {
									// Удаляем из модели
									if (findedContact.deletePhone(phone_id)) {
										// Удаляем из представления
										$('.contact_phone_container[data-contactid="' + contact.id + '"][data-phoneid="' + phone_id + '"]').remove();									
										return;
									}
									 
								}
							}
							
							alert('Не удалось удалить телефон')
						});
					}
				});				
				
				_div_contact_phones_container
					.append(_div_contact_phone)
					.append(_div_delete_phone);
					
				_div_contact_phones.append(_div_contact_phones_container);
			}
			
			_td.append(_div_contact_phones);
			
			_tr.append(_td);
			
			
			_tr.append($('<td>')
				.append($('<div class="action_container">')
					.append($('<a>', {
						text: 'Доб.тел.',
						'data-contactid': contact.id,
						click: function() {
							$("#add_phone_contact_id").val(contact.id);
							$(".screens").children("div.screen").hide();
							$(".screens").children("div.add_phone").show();
						}
					}))
				)			
				.append($('<div class="action_container">')
					.append($('<a>', {
						text: 'Редактировать',
						'data-contactid': contact.id,
						class: "update_contact_btn",
						click: function() {
							let contact_id = $(this).data("contactid");
							let contact = _app.contactList.find(x => x.id == contact_id);
							
							if (contact instanceof Contact) {
								_app.renderUpdateContactForm("update_contact_form_container", contact);
							}
							
							$(".screens").children("div.screen").hide();
							$(".screens").children("div.update_contact").show();
						}
					}))
				)
				.append($('<div class="action_container">')
					.append($('<a>', {
						text: 'Удалить',
						'data-contactid': contact.id,
						click: function() {
							let _this = $(this);
						
							if (confirm("Действительно удалить контакт?")) {
								$.get("/", { action: "delete_contact", contact_id: contact.id }, function(response) {
									let responseObj = undefined;
									try {
										responseObj = JSON.parse(response);
									} catch (e) {
										alert('Не удалось удалить контакт');
										console.log(e);
										return;
									}
									
									if (responseObj && responseObj.result && responseObj.result == 'success') {
										// Удаляем из модели
										if (_app.deleteContact(contact.id)) {
											// Удаляем из представления
											_this.parent().parent().parent().remove();
										}
									} else {
										alert('Не удалось удалить контакт');
									}
								});
							}
						}
					}))
				)
			);
			
			$('#contacts_table').append(_tr);		
	}	
	
	
	// Удалить контакт
	deleteContact(id) {
		// Ищем контакт по id в массиве контактов
		let findedContact = (this.contactList.find(x => x.id == id));
		
		if (findedContact instanceof Contact) {
			// Получаем индекс найденного контакта
			let indx = this.contactList.indexOf(findedContact);

			// Удаляем из массива
			if (indx > -1) {
				this.contactList.splice(indx, 1);
				return true;
			}
		}
		
		return false;
	}
	

	// Обновляет массив контактов в приложении, загружая данные с сервера
	reloadContactList() {
		let _app = this;
		this.contactList = [];
	
		$.get("/", { action: "list" }, function( response ) {
			let responseObj = undefined;
			try {
				responseObj = JSON.parse(response);
			} catch (e) {
				alert('Не удалось загрузить список контактов');
				console.log(e);
				return;
			}

			if (responseObj && responseObj.result == 'success' && responseObj.data) {
				let list = responseObj.data;
			
				for(let contact_key in list) {
					let contact = list[contact_key];
					let tmp_contact = new Contact(contact.id);
					
					// Задаем наименование контакта
					tmp_contact.changeName(contact.name);
					
					// Задаем телефоны
					for(let phone_key in contact.phones) {	
						let phone = contact.phones[phone_key];
						let tmp_phone = new Phone(tmp_contact, phone.id);
						tmp_phone.changeNumber(phone.phone);
						tmp_contact.addPhone(tmp_phone);
					}
					
					_app.addContact(tmp_contact);
				}
			}
		});
	}	

	
	// Спрятать контакты, не соответствующие поисковому запросу
	hideContactsBySearchCondition(text) {
		text = text.toLowerCase();
		$("tr").removeClass('hidden_by_search');	
	
		if (text != "") {
			for(let contact_key in this.contactList) {
				let contact = this.contactList[contact_key];
				let isNameSatisfySearchFlag = (contact.name.toLowerCase().indexOf(text) != -1);

				let isPhoneSatisfySearchFlag = false;
				for(let phone_key in contact.phones) {
					let phone = contact.phones[phone_key];
					if (phone.number.toLowerCase().indexOf(text) != -1) {
						isPhoneSatisfySearchFlag = true;
						break;
					}
				}
				
				if (!isNameSatisfySearchFlag && !isPhoneSatisfySearchFlag) {
					$('div.contact_name[data-id="' + contact.id + '"]').parent().parent().addClass('hidden_by_search');
				}
			}
		}
	}
	

	renderUpdateContactForm(container_id, contact) {
		let cont = $("#" + container_id);
		cont.html("");
		
		// Текстовое поле "Имя"
		cont.append($('<input>', {
			type: "text",
			class: "update_contact_name",
			placeholder: "Имя",	
			val: contact.name,
			change: function() {
				contact.changeName($(this).val());
				$.get('/', { action: 'update_contact', contact_id: contact.id, name: contact.name }, function(response) {
					let responseObj = undefined;
					try {
						responseObj = JSON.parse(response);
					} catch (e) {
						alert('Не удалось отредактировать контакт');
						console.log(e);
						return;
					}					
					
					if (responseObj && responseObj.result && responseObj.result == 'success') {
						$('.contact_name[data-id="' + contact.id + '"]').html(contact.name);
					}
				});
			}
		}));
		
		
		for(let phone_key in contact.phones) {
			let phone = contact.phones[phone_key];

			cont.append($('<input>', { 
				type: "text",
				val: phone.number,
				class: "update_contact_phone",
				placeholder: "Телефон",	
				change: function() {
					phone.changeNumber($(this).val());
					$.get('/', { action: 'update_phone', phone_id: phone.id, phone: phone.number }, function(response) {
						let responseObj = undefined;
						try {
							responseObj = JSON.parse(response);
						} catch (e) {
							alert('Не удалось отредактировать телефон');
							console.log(e);
							return;
						}					
						
						if (responseObj && responseObj.result && responseObj.result == 'success') {
							$('.contact_phone[data-phoneid="' + phone.id + '"]').html(phone.number);
						}
					});
				}
			}));
		}
		
		
		
		cont.append($('<input>', {
			type: "button",
			value: "Вернуться к контактам",
			click: function() {
				$(".screens").children("div.screen").hide();
				$(".screens").children("div.contacts_list").show();
			}
		}));
	}
	 
	// Перерисовать контакты
	reRenderContactList() {
		let _app = this;
		this.clearContactTable();
		
		for(let contact_key in this.contactList) {
			let contact = this.contactList[contact_key];
			console.log(contact);
			_app.addContact(contact);
			
		}
	}

	// Очистить таблицу с контактами
	clearContactTable() {
		$('#contacts_table tr:not(:first)').remove();
	}
	
}


$(document).ready(function() {
	let app = new App();	

	$("#add_contact").click(function() {
		$(".screens").children("div.screen").hide();
		$(".screens").children("div.add_contact").show();
	});
	
	
	$("#search_contact").change(function() {
		app.hideContactsBySearchCondition($(this).val());
	});
	
	$("#reset_search").click(function() {
		$("#search_contact").val("");
		app.hideContactsBySearchCondition("");
	});

	$("#add_contact_submit").click(function() {
		$.get(
			"/", 
			{ 
				action: "add_contact", 
				name: $("#add_contact_name").val(), 
				phone: $("#add_contact_phone").val() 
			}, 
			function(response) {
				$(".screens").children("div.screen").hide();
				$(".screens").children("div.contacts_list").show();		

				let responseObj = undefined;
				try {
					responseObj = JSON.parse(response);
				} catch (e) {
					alert('Не удалось добавить контакт');
					console.log(e);
					return;
				}				
			
				if (responseObj && responseObj.result && responseObj.result == 'success') {
					if (responseObj.contact_id && responseObj.contact_id > 0 && responseObj.phone_id && responseObj.phone_id > 0) {
						let contact = new Contact(responseObj.contact_id);
						contact.changeName($("#add_contact_name").val());
						
						let phone = new Phone(contact, responseObj.phone_id);
						phone.changeNumber($("#add_contact_phone").val());
						
						contact.addPhone(phone);
						
						app.addContact(contact);
						
						$("#add_contact_name").val("");
						$("#add_contact_phone").val("");
						return;
					}
				}
				
				alert('Не удалось добавить контакт');
			}
		);
	});
	
	
	$("#add_phone_submit").click(function() {
		$.get(
			"/", 
			{ 
				action: "add_phone", 
				contact_id: $("#add_phone_contact_id").val(),
				phone: $("#add_phone").val()
			}, 
			function(response) {
				$(".screens").children("div.screen").hide();
				$(".screens").children("div.add_phone").show();		

				let responseObj = undefined;
				try {
					responseObj = JSON.parse(response);
				} catch (e) {
					alert('Не удалось добавить телефон');
					console.log(e);
					return;
				}				
			
				if (responseObj && responseObj.result && responseObj.result == 'success' && responseObj.phone_id && responseObj.phone_id > 0) {
					let contact = app.contactList.find(x => x.id == $("#add_phone_contact_id").val());
					if (contact instanceof Contact) {
						let phone = new Phone(contact, responseObj.phone_id);
						phone.changeNumber($("#add_phone").val());
						// Добавляем в модель
						contact.addPhone(phone);
						
						// Добавляем в представление
						let contact_phone_container = $('<div>', {
							class: "contact_phone_container",
							'data-contactid': contact.id,
							'data-phoneid': responseObj.phone_id
						});
						
						let contact_phone = $('<div>', {
							class: "contact_phone",
							text: phone.number,
							'data-contactid': contact.id,
							'data-phoneid': responseObj.phone_id									
						});
						
						let contact_phone_delete = $('<div>', {
							class: "contact_phone_delete",
							'data-contactid': contact.id,
							'data-phoneid': responseObj.phone_id,
							text: "x",
							click: function() {
								if (!confirm("Вы действительно хотите удалить этот телефон?"))
									return;
									
								let _this = $(this);
								let phone_id = _this.data('phoneid');

								$.get("/", { action: "delete_phone", phone_id: phone_id}, function( response ) {	
									let responseObj = undefined;
									try {
										responseObj = JSON.parse(response);
									} catch (e) {
										alert('Не удалось удалить телефон!');
										console.log(e);
										return;
									}
								
									if (responseObj && responseObj.result && responseObj.result == 'success') {
										// Удаляем из модели
										let findedContact = (app.contactList.find(x => x.id == contact.id));
										if (findedContact instanceof Contact) {
											// Удаляем из модели
											if (findedContact.deletePhone(phone_id)) {
												// Удаляем из представления
												$('.contact_phone_container[data-contactid="' + contact.id + '"][data-phoneid="' + phone_id + '"]').remove();									
												return;
											}
											 
										}
									}
									
									alert('Не удалось удалить телефон')
								});
							}
						});
						
						contact_phone_container.append(contact_phone);
						contact_phone_container.append(contact_phone_delete);
						
						$('.contact_phones[data-contactid="' + contact.id + '"]').append(contact_phone_container);
						
						$(".screens").children("div.screen").hide();
						$(".screens").children("div.contacts_list").show();
						
						$("#add_phone_contact_id").val("");
						$("#add_phone").val("");
						return;
					}
				}
				
				alert('Не удалось добавить телефон');
			}
		);	
	});
});