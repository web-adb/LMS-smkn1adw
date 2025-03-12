-- CreateTable
CREATE TABLE `Tugas` (
    `id` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL,
    `deadline` DATETIME(3) NOT NULL,
    `lampiran` VARCHAR(191) NULL,
    `selesai` BOOLEAN NOT NULL DEFAULT false,
    `dikumpulkan` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
