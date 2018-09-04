1. �������� �� � ������:

-- ���� ������: `test`
>��������� ������� `contact`
>>CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `name` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

> ��������� ������� `phone`
>>CREATE TABLE `phone` (
  `id` int(11) NOT NULL,
  `contact_id` int(11) NOT NULL,
  `phone` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

>ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

>ALTER TABLE `phone`
  ADD PRIMARY KEY (`id`);

>������� ���� ������� `phone`
>>ALTER TABLE `phone` ADD CONSTRAINT `phone_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
  
2. ������������ ����������� � ������ ���-�������
>git clone https://github.com/icewickru/phonebookv3.git

3. ������ � vendor\Phonebook\DBHelper.php ����� � ������ �� ��
