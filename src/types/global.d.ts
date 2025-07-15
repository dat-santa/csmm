//khai báo window.google

interface CredentialResponse {
    credential: string;
    select_by: string;
    clientId?: string;
  }
  
  interface GoogleOneTap {
    accounts: {
      id: {
        initialize: (options: {
          client_id: string;
          callback: (response: CredentialResponse) => void;
          auto_select?: boolean;
        }) => void;
        prompt: () => void;
      };
    };
  }
  
  declare global {
    interface Window {
      google: GoogleOneTap;
    }
  }
  