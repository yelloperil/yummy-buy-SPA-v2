
```html
<body class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-300">
    <!-- @@@ OUTER WRAPPER Outer Wrapper -->
    <div class="container mx-auto px-4 py-2 sm:py-8">
    <!-- @@@ MAIN BODY SECTION -->
        
        <!-- Version 5.0 - Product Catalogue Section, Shopping Cart Section, Order Section -->
        <div class="flex flex-col lg:flex-row gap-8">
        <!-- Authentication Modal -->
        <div id="authModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 hidden">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                <h3 class="text-xl font-bold mb-4 text-primary">Authentication</h3>
                <!-- @@@@@@@ Phone Number Input -->
                <div id="phoneInputContainer" class="space-y-4">
                    <p class="mb-4">Please enter your phone number to authenticate. We'll send you a verification code via SMS.</p>
                    <div class="relative">
                        <div id="recaptcha-container" class="mb-4"></div>
                        <label for="phoneNumber" class="block mb-1">Phone Number</label>
                        <input type="tel" id="phoneNumber" placeholder="+1 (604) 969-3855" 
                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-base">
                        <p id="phoneError" class="text-red-500 text-sm mt-1 hidden"></p>
                    </div>
                    <button id="sendCodeBtn" class="w-full bg-primary hover:bg-secondary text-white py-3 px-4 rounded-md font-medium">
                        Send Verification Code
                    </button>
                </div>
                <!-- Verification Code Input -->
                <div id="codeInputContainer" class="space-y-4 hidden">
                    <button id="verifyCodeBtn" class="w-full bg-primary hover:bg-secondary text-white py-3 px-4 rounded-md font-medium">
                        Verify Code
                    </button>
   </div>
                <!-- Success Message -->
                <div id="authSuccessContainer" class="hidden text-center py-6">
                    <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-green-500">Authentication Successful!</h3>
                    <p class="mb-4">You are now logged in.</p>
                </div>
                <button id="closeAuthModalBtn" class="mt-4 w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md">
                    Close
                </button>
    </div>

    </div>
    </body>
```

```js
phoneNumberInput.addEventListener('input', function(e) {
  // Auto-focus to send code button after complete entry (10 digits)
  if (cleanedValue.length === 10) {

    setTimeout(() => {

        sendCodeBtn.focus();

    }, 300);

}
});

// Open auth modal when login button is clicked
loginBtn.addEventListener('click', () => {
    if (isLoggedIn) {
        // Show logout confirmation or account management options
        // if (confirm('Do you want to log out?')) {
            logoutUser();
        // }
    } else {
        showAuthModal();
    }
});

// Close auth modal
closeAuthModalBtn.addEventListener('click', () => {
    authModal.classList.add('hidden');
    resetAuthModal();
});
```