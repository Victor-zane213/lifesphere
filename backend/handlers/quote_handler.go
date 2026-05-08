package handlers

import (
	"net/http"
	"strconv"

	"lifesphere-backend/database"
	"lifesphere-backend/models"

	"github.com/gin-gonic/gin"
)

func GetQuotes(c *gin.Context) {
	var quotes []models.Quote
	database.DB.Order("created_at desc").Find(&quotes)
	c.JSON(http.StatusOK, quotes)
}

func GetRandomQuote(c *gin.Context) {
	var quote models.Quote
	result := database.DB.Order("RANDOM()").First(&quote)
	if result.Error != nil {
		c.JSON(http.StatusOK, gin.H{})
		return
	}
	c.JSON(http.StatusOK, quote)
}

func CreateQuote(c *gin.Context) {
	var quote models.Quote
	if err := c.ShouldBindJSON(&quote); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&quote)
	c.JSON(http.StatusCreated, quote)
}

func UpdateQuote(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var quote models.Quote
	if err := database.DB.First(&quote, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if err := c.ShouldBindJSON(&quote); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&quote)
	c.JSON(http.StatusOK, quote)
}

func DeleteQuote(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	database.DB.Delete(&models.Quote{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
