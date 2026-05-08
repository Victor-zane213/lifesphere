package handlers

import (
	"net/http"
	"sort"
	"strconv"

	"lifesphere-backend/database"
	"lifesphere-backend/models"

	"github.com/gin-gonic/gin"
)

// --- Years ---

func GetYears(c *gin.Context) {
	var years []int
	// Get years from Year table
	database.DB.Model(&models.Year{}).
		Order("year desc").
		Pluck("year", &years)
	// Also include years from data tables
	var logYears, reflectionYears, todoYears []int
	database.DB.Model(&models.DailyLog{}).Select("DISTINCT year").Pluck("year", &logYears)
	database.DB.Model(&models.DailyReflection{}).Select("DISTINCT year").Pluck("year", &reflectionYears)
	database.DB.Model(&models.Todo{}).Select("DISTINCT year").Pluck("year", &todoYears)

	all := make(map[int]bool)
	for _, y := range years { all[y] = true }
	for _, y := range logYears { all[y] = true }
	for _, y := range reflectionYears { all[y] = true }
	for _, y := range todoYears { all[y] = true }

	result := make([]int, 0, len(all))
	for y := range all { result = append(result, y) }
	sort.Slice(result, func(i, j int) bool { return result[i] > result[j] })

	c.JSON(http.StatusOK, result)
}

func CreateYear(c *gin.Context) {
	var body struct {
		Year int `json:"year"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	year := models.Year{Year: body.Year}
	database.DB.FirstOrCreate(&year, models.Year{Year: body.Year})
	c.JSON(http.StatusCreated, year)
}

// --- DailyLog ---

func GetDailyLogs(c *gin.Context) {
	var items []models.DailyLog
	query := database.DB.Order("date desc")
	if year := c.Query("year"); year != "" {
		query = query.Where("year = ?", year)
	}
	query.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateDailyLog(c *gin.Context) {
	var item models.DailyLog
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&item)
	c.JSON(http.StatusCreated, item)
}

func UpdateDailyLog(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var item models.DailyLog
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

func DeleteDailyLog(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	database.DB.Delete(&models.DailyLog{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}

// --- DailyReflection ---

func GetDailyReflections(c *gin.Context) {
	var items []models.DailyReflection
	query := database.DB.Order("date desc")
	if year := c.Query("year"); year != "" {
		query = query.Where("year = ?", year)
	}
	query.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateDailyReflection(c *gin.Context) {
	var item models.DailyReflection
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&item)
	c.JSON(http.StatusCreated, item)
}

func UpdateDailyReflection(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var item models.DailyReflection
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

func DeleteDailyReflection(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	database.DB.Delete(&models.DailyReflection{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}

// --- Todo ---

func GetTodos(c *gin.Context) {
	var items []models.Todo
	query := database.DB.Order("date desc")
	if year := c.Query("year"); year != "" {
		query = query.Where("year = ?", year)
	}
	query.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateTodo(c *gin.Context) {
	var item models.Todo
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&item)
	c.JSON(http.StatusCreated, item)
}

func UpdateTodo(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var item models.Todo
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

func DeleteTodo(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	database.DB.Delete(&models.Todo{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
