-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "phone" TEXT,
    "addresses" TEXT DEFAULT '[]',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name_en" TEXT NOT NULL,
    "name_ne" TEXT,
    "slug" TEXT NOT NULL,
    "description_en" TEXT,
    "description_ne" TEXT,
    "image" TEXT,
    "parent_category_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "categories_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name_en" TEXT NOT NULL,
    "name_ne" TEXT,
    "slug" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_ne" TEXT,
    "price" REAL NOT NULL,
    "compare_price" REAL NOT NULL DEFAULT 0,
    "images" TEXT DEFAULT '[]',
    "category_id" TEXT NOT NULL,
    "tags" TEXT DEFAULT '[]',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "theme" TEXT NOT NULL DEFAULT 'default',
    "specifications" TEXT DEFAULT '{}',
    "colors" TEXT DEFAULT '[]',
    "ratings" TEXT DEFAULT '{"average":0,"count":0}',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "shipping_address" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL DEFAULT 'cod',
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "total_amount" REAL NOT NULL,
    "whatsapp_redirected" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title_en" TEXT NOT NULL,
    "title_ne" TEXT NOT NULL,
    "description_en" TEXT,
    "description_ne" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quiz_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "text_en" TEXT NOT NULL,
    "text_ne" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'single_select',
    "category" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "quiz_questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quiz_options" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question_id" TEXT NOT NULL,
    "label_en" TEXT NOT NULL,
    "label_ne" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "tags" TEXT DEFAULT '[]',
    "weight" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "quiz_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "quiz_questions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quiz_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quiz_id" TEXT NOT NULL,
    "user_id" TEXT,
    "ip_address" TEXT,
    "session_id" TEXT,
    "matched_tags" TEXT DEFAULT '[]',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "quiz_responses_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "quiz_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quiz_answers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "response_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_options" TEXT DEFAULT '[]',
    "tags" TEXT DEFAULT '[]',
    CONSTRAINT "quiz_answers_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "quiz_responses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quiz_recommendations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "response_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "score" INTEGER,
    "reason" TEXT DEFAULT '[]',
    CONSTRAINT "quiz_recommendations_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "quiz_responses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "quiz_recommendations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_slug_idx" ON "products"("slug");
