package apperrors

import (
	"errors"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestErrorStatus(t *testing.T) {
	tests := []struct {
		name string
		err  *Error
		want int
	}{
		{"authorization", NewAuthorization("unauthorized"), http.StatusUnauthorized},
		{"bad request", NewBadRequest("invalid input"), http.StatusBadRequest},
		{"conflict", NewConflict("email", "a@example.com"), http.StatusConflict},
		{"internal", NewInternal(), http.StatusInternalServerError},
		{"not found", NewNotFound("user", "123"), http.StatusNotFound},
		{"payload too large", NewPayloadTooLarge(10, 11), http.StatusRequestEntityTooLarge},
		{"service unavailable", NewServiceUnavailable(), http.StatusServiceUnavailable},
		{"unsupported media type", NewUnsupportedMediaType("expected JSON"), http.StatusUnsupportedMediaType},
		{"unknown type defaults to internal", &Error{Type: Type("UNKNOWN")}, http.StatusInternalServerError},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, tt.err.Status())
		})
	}
}

func TestStatus(t *testing.T) {
	t.Run("application error", func(t *testing.T) {
		err := NewNotFound("user", "missing")
		assert.Equal(t, http.StatusNotFound, Status(err))
	})

	t.Run("wrapped application error", func(t *testing.T) {
		err := errors.Join(errors.New("request failed"), NewConflict("email", "a@example.com"))
		assert.Equal(t, http.StatusConflict, Status(err))
	})

	t.Run("standard error", func(t *testing.T) {
		assert.Equal(t, http.StatusInternalServerError, Status(errors.New("unexpected failure")))
	})

	t.Run("nil error", func(t *testing.T) {
		assert.Equal(t, http.StatusInternalServerError, Status(nil))
	})
}

func TestErrorFactories(t *testing.T) {
	assert.EqualError(t, NewAuthorization("denied"), "denied")
	assert.Equal(t, "Bad request. Reason: invalid input", NewBadRequest("invalid input").Error())
	assert.Equal(t, "resource: email with value: a@example.com already exists", NewConflict("email", "a@example.com").Error())
	assert.Equal(t, ServerError, NewInternal().Error())
	assert.Equal(t, "resource: user with value: 123 not found", NewNotFound("user", "123").Error())
	assert.Equal(t, "Max payload size of 10 exceeded. Actual payload size: 11", NewPayloadTooLarge(10, 11).Error())
	assert.Equal(t, "Service unavailable or timed out", NewServiceUnavailable().Error())
	assert.EqualError(t, NewUnsupportedMediaType("expected JSON"), "expected JSON")
}
