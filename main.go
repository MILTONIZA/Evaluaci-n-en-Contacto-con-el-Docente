package main

import (
	"net/http"
	//"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Libro struct {
	ID              uint   `json:"id" gorm:"primaryKey"`
	Titulo          string `json:"titulo"`
	Autor           string `json:"autor"`
	Editorial       string `json:"editorial"`
	AnioPublicacion int    `json:"anio_publicacion"`
	ISBN            string `json:"isbn"`
}

var db *gorm.DB

func main() {

	dsn := "root:12345678@tcp(localhost:3306)/libro?charset=utf8mb4&parseTime=True&loc=Local"

	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	r := gin.Default()
	r.Use(cors.Default())

	r.POST("/libros", crearLibro)
	r.GET("/libros", listarLibros)
	r.GET("/libros/:id", obtenerLibro)
	r.PUT("/libros/:id", actualizarLibro)
	r.PATCH("/libros/:id", actualizarParcial)
	r.DELETE("/libros/:id", eliminarLibro)
	r.GET("/autor/:autor", buscarPorAutor)
	r.GET("/contador", contarLibros)

	r.Run(":8080")
}

func crearLibro(c *gin.Context) {
	var libro Libro
	c.BindJSON(&libro)
	db.Create(&libro)
	c.JSON(http.StatusCreated, libro)
}

func listarLibros(c *gin.Context) {
	var libros []Libro
	db.Find(&libros)
	c.JSON(http.StatusOK, libros)
}

func obtenerLibro(c *gin.Context) {
	var libro Libro
	db.First(&libro, c.Param("id"))
	c.JSON(http.StatusOK, libro)
}

func actualizarLibro(c *gin.Context) {
	var libro Libro
	db.First(&libro, c.Param("id"))

	var datos Libro
	c.BindJSON(&datos)

	db.Model(&libro).Updates(datos)

	c.JSON(http.StatusOK, libro)
}

func actualizarParcial(c *gin.Context) {
	var libro Libro
	db.First(&libro, c.Param("id"))

	var datos map[string]interface{}
	c.BindJSON(&datos)

	db.Model(&libro).Updates(datos)

	c.JSON(http.StatusOK, libro)
}

func eliminarLibro(c *gin.Context) {
	db.Delete(&Libro{}, c.Param("id"))
	c.JSON(http.StatusOK, gin.H{
		"mensaje": "Libro eliminado",
	})
}

func buscarPorAutor(c *gin.Context) {
	var libros []Libro
	db.Where("autor = ?", c.Param("autor")).Find(&libros)
	c.JSON(http.StatusOK, libros)
}

func contarLibros(c *gin.Context) {
	var total int64
	db.Model(&Libro{}).Count(&total)

	c.JSON(http.StatusOK, gin.H{
		"total": total,
	})
}
