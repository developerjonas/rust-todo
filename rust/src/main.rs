use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use actix_cors::Cors;
use serde::{Desearilize, Serealize};
use uuid::Uuid;
use std::sync::Mutex;
use chrono::{Utc, DateTime};

#[derive(Searlize, Deserialize, Clone )]

struct TodoItem {
    id: Uuid,
    title: String,
    completed: bool,
    created_at: DateTime<Utc>
}

#[derive(Desearilize)]

struct CreateTodoItem{
    title:string,
    completed: bool,

}