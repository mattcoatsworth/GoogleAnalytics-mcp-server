import { google } from 'googleapis';

    /**
     * Creates an authorized Google Analytics Data API client
     * @returns {Promise<Object>} The authorized Analytics Data client
     */
    export async function getAnalyticsClient() {
      try {
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
        });

        const authClient = await auth.getClient();
        const analyticsData = google.analyticsdata({
          version: 'v1beta',
          auth: authClient,
        });

        return analyticsData;
      } catch (error) {
        console.error('Error creating Analytics client:', error);
        throw new Error(`Failed to authenticate with Google Analytics: ${error.message}`);
      }
    }

    /**
     * Gets the default property ID from environment variables
     * @returns {string} The default property ID
     */
    export function getDefaultPropertyId() {
      return process.env.DEFAULT_PROPERTY_ID;
    }
