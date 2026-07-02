CREATE TABLE `ammunition` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`caliber` varchar(50) NOT NULL,
	`manufacturer` varchar(255),
	`description` text,
	`specifications` text,
	`imageUrl` text,
	`unitsPerBox` int,
	`inStock` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ammunition_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`duration` int NOT NULL,
	`prerequisites` text,
	`instructor` varchar(255),
	`maxParticipants` int,
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schedule_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`documentType` enum('CAC','RG') NOT NULL,
	`documentNumber` varchar(50) NOT NULL,
	`requestedDate` date NOT NULL,
	`requestedTime` varchar(5) NOT NULL,
	`numberOfPeople` int DEFAULT 1,
	`experience` enum('beginner','intermediate','advanced'),
	`observations` text,
	`status` enum('pending','approved','rejected','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schedule_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weapons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`caliber` varchar(50) NOT NULL,
	`manufacturer` varchar(255),
	`description` text,
	`specifications` text,
	`imageUrl` text,
	`inStock` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weapons_id` PRIMARY KEY(`id`)
);
