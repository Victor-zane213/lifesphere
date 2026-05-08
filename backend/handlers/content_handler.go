package handlers

import (
	"net/http"
	"strconv"

	"lifesphere-backend/database"
	"lifesphere-backend/models"

	"github.com/gin-gonic/gin"
)

func GetInvestments(c *gin.Context) {
	var items []models.Investment
	database.DB.Order("created_at desc").Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateInvestment(c *gin.Context) {
	var item models.Investment
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&item)
	c.JSON(http.StatusCreated, item)
}

func UpdateInvestment(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var item models.Investment
	if err := database.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&item)
	c.JSON(http.StatusOK, item)
}

func DeleteInvestment(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	database.DB.Delete(&models.Investment{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}

func GetReadings(c *gin.Context) {
	var items []models.Reading
	database.DB.Order("created_at desc").Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateReading(c *gin.Context) {
	var item models.Reading
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&item)
	c.JSON(http.StatusCreated, item)
}

func UpdateReading(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var item models.Reading
	if err := database.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&item)
	c.JSON(http.StatusOK, item)
}

func DeleteReading(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	database.DB.Delete(&models.Reading{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}

func GetReflectionPosts(c *gin.Context) {
	var items []models.ReflectionPost
	database.DB.Order("created_at desc").Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateReflectionPost(c *gin.Context) {
	var item models.ReflectionPost
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&item)
	c.JSON(http.StatusCreated, item)
}

func UpdateReflectionPost(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var item models.ReflectionPost
	if err := database.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&item)
	c.JSON(http.StatusOK, item)
}

func DeleteReflectionPost(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	database.DB.Delete(&models.ReflectionPost{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
