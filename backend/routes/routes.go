package routes

import (
	"lifesphere-backend/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Setup() *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")
	{
		// Quotes
		api.GET("/quotes", handlers.GetQuotes)
		api.GET("/quotes/random", handlers.GetRandomQuote)
		api.POST("/quotes", handlers.CreateQuote)
		api.PUT("/quotes/:id", handlers.UpdateQuote)
		api.DELETE("/quotes/:id", handlers.DeleteQuote)

		// Years
		api.GET("/years", handlers.GetYears)
		api.POST("/years", handlers.CreateYear)

		// Daily Logs
		api.GET("/daily-logs", handlers.GetDailyLogs)
		api.POST("/daily-logs", handlers.CreateDailyLog)
		api.PUT("/daily-logs/:id", handlers.UpdateDailyLog)
		api.DELETE("/daily-logs/:id", handlers.DeleteDailyLog)

		// Daily Reflections
		api.GET("/daily-reflections", handlers.GetDailyReflections)
		api.POST("/daily-reflections", handlers.CreateDailyReflection)
		api.PUT("/daily-reflections/:id", handlers.UpdateDailyReflection)
		api.DELETE("/daily-reflections/:id", handlers.DeleteDailyReflection)

		// Todos
		api.GET("/todos", handlers.GetTodos)
		api.POST("/todos", handlers.CreateTodo)
		api.PUT("/todos/:id", handlers.UpdateTodo)
		api.DELETE("/todos/:id", handlers.DeleteTodo)

		// Investments
		api.GET("/investments", handlers.GetInvestments)
		api.POST("/investments", handlers.CreateInvestment)
		api.PUT("/investments/:id", handlers.UpdateInvestment)
		api.DELETE("/investments/:id", handlers.DeleteInvestment)

		// Readings
		api.GET("/readings", handlers.GetReadings)
		api.POST("/readings", handlers.CreateReading)
		api.PUT("/readings/:id", handlers.UpdateReading)
		api.DELETE("/readings/:id", handlers.DeleteReading)

		// Reflection Posts
		api.GET("/reflections", handlers.GetReflectionPosts)
		api.POST("/reflections", handlers.CreateReflectionPost)
		api.PUT("/reflections/:id", handlers.UpdateReflectionPost)
		api.DELETE("/reflections/:id", handlers.DeleteReflectionPost)
	}

	return r
}
