
// Centralized API Client (TypeScript-inspired, scalable, environment-agnostic)

// Get API base URL from environment (Vite)
function getApiBaseUrl() {
    return import.meta.env.VITE_API_BASE_URL || '';
}

class ApiClient {
    // Core request method
    async request(endpoint, options = {}, retries = 1) {
        const apiBaseUrl = getApiBaseUrl();
        const url = `${apiBaseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

        // Timeout support
        let timeoutId = null;
        let abortController = null;
        if (!options.signal) {
            abortController = new AbortController();
            timeoutId = setTimeout(() => {
                abortController.abort();
            }, 30000); // 30s timeout
        }

        const config = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
            signal: options.signal || abortController?.signal,
        };

        try {
            const response = await fetch(url, config);
            if (timeoutId) clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = `Request failed: ${response.status} ${response.statusText}`;
                if (errorData.detail) {
                    if (Array.isArray(errorData.detail)) {
                        errorMessage = errorData.detail.map(err => {
                            const field = err.loc ? err.loc.join('.') : 'field';
                            return `${field}: ${err.msg || err.message || 'Invalid value'}`;
                        }).join(', ');
                    } else if (typeof errorData.detail === 'string') {
                        errorMessage = errorData.detail;
                    } else {
                        errorMessage = JSON.stringify(errorData.detail);
                    }
                } else if (errorData.message) {
                    errorMessage = typeof errorData.message === 'string' ? errorData.message : JSON.stringify(errorData.message);
                }
                throw new Error(errorMessage);
            }
            if (response.status === 204) return {};
            const text = await response.text();
            if (!text) return {};
            return JSON.parse(text);
        } catch (error) {
            if (timeoutId) clearTimeout(timeoutId);
            const isNetworkError = error?.message?.includes('Failed to fetch') || error?.name === 'AbortError';
            if (isNetworkError && retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return this.request(endpoint, options, retries - 1);
            }
            throw error instanceof Error ? error : new Error('An unexpected error occurred');
        }
    }

    get(endpoint, params) {
        let queryString = '';
        if (params) {
            const filteredParams = {};
            Object.keys(params).forEach(key => {
                const value = params[key];
                if (value !== undefined && value !== null) {
                    filteredParams[key] = String(value);
                }
            });
            const urlParams = new URLSearchParams(filteredParams);
            if (urlParams.toString()) {
                queryString = `?${urlParams.toString()}`;
            }
        }
        console.log('[API GET]', endpoint, 'Params:', params);
        return this.request(`${endpoint}${queryString}`);
    }

    post(endpoint, data) {
        console.log('[API POST]', endpoint, 'Payload:', data);
        return this.request(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}

const api = new ApiClient();

// Online Website API resource
export const onlineWebsiteApi = {
    submitOrder: (data) => api.post('/api/online/order', data),
    submitContact: (data) => api.post('/api/online/contact', data),
};
