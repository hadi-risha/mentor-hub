import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import './index.css';
import App from './App';
import { store } from './redux/store';
import ChatProvider from './chatContext/ChatProvider.js';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme.js";
import { useMemo } from "react";

// Define the theme configuration
// const theme = extendTheme({
//   config: {
//     initialColorMode: 'light',
//     useSystemColorMode: false,
//   },
// });

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


  // const mode = "light"
  // const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const RootComponent = () => {
  const mode = "light"; // Replace with dynamic mode logic if needed
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ChakraProvider>
            <Router>
              <QueryClientProvider client={queryClient}>
                <ChatProvider>
                  <App />
                </ChatProvider>
              </QueryClientProvider>
            </Router>
          </ChakraProvider>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
};

root.render(<RootComponent />)


// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <ChakraProvider >
//         <Router>
//           {/* Wrap your app with QueryClientProvider */}
//           <QueryClientProvider client={queryClient}>
//           <ChatProvider> 
//             <App />
//           </ChatProvider>
//           </QueryClientProvider>
//         </Router>
//       </ChakraProvider>
//       </ThemeProvider>
//     </Provider>
//   </React.StrictMode>
// );
