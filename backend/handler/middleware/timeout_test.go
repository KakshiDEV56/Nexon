package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sentrionic/valkyrie/model/apperrors"
	"github.com/stretchr/testify/assert"
)

func TestTimeoutHandlerCompletesNormally(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(Timeout(time.Second, apperrors.NewServiceUnavailable()))
	router.GET("/ok", func(c *gin.Context) {
		c.Header("X-Test", "preserved")
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/ok", nil)
	router.ServeHTTP(recorder, request)

	assert.Equal(t, http.StatusOK, recorder.Code)
	assert.Equal(t, "preserved", recorder.Header().Get("X-Test"))
	assert.JSONEq(t, `{"status":"ok"}`, recorder.Body.String())
}

func TestTimeoutHandlerReturnsServiceUnavailable(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(Timeout(10*time.Millisecond, apperrors.NewServiceUnavailable()))
	router.GET("/slow", func(c *gin.Context) {
		time.Sleep(50 * time.Millisecond)
		c.JSON(http.StatusOK, gin.H{"status": "too late"})
	})

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/slow", nil)
	router.ServeHTTP(recorder, request)

	assert.Equal(t, http.StatusServiceUnavailable, recorder.Code)
	assert.Equal(t, "application/json", recorder.Header().Get("Content-Type"))
	assert.Contains(t, recorder.Body.String(), "Service unavailable or timed out")
	assert.NotContains(t, recorder.Body.String(), "too late")
}

func TestTimeoutWriterPreventsWritesAfterTimeout(t *testing.T) {
	gin.SetMode(gin.TestMode)
	recorder := httptest.NewRecorder()
	_, ctx := gin.CreateTestContext(recorder)
	writer := &timeoutWriter{ResponseWriter: ctx.Writer, h: make(http.Header)}

	writer.SetTimedOut()
	n, err := writer.Write([]byte("late response"))

	assert.NoError(t, err)
	assert.Zero(t, n)
	assert.Empty(t, writer.wbuf.String())
}

func TestTimeoutWriterKeepsFirstStatusCode(t *testing.T) {
	gin.SetMode(gin.TestMode)
	recorder := httptest.NewRecorder()
	_, ctx := gin.CreateTestContext(recorder)
	writer := &timeoutWriter{ResponseWriter: ctx.Writer, h: make(http.Header)}

	writer.WriteHeader(http.StatusAccepted)
	writer.WriteHeader(http.StatusBadRequest)

	assert.Equal(t, http.StatusAccepted, writer.code)
	assert.True(t, writer.wroteHeader)
}
