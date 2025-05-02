



        ```html
                <!-- Verification Code Input -->
                <div id="codeInputContainer" class="space-y-4 hidden">
                    <p class="mb-4">Enter the 6-digit verification code sent to your phone.</p>
                    <div class="flex justify-between gap-2 mb-4">
                        <input type="text" maxlength="1" class="verification-code-input w-12 h-12 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-xl font-bold">
                        <input type="text" maxlength="1" class="verification-code-input w-12 h-12 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-xl font-bold">
                        <input type="text" maxlength="1" class="verification-code-input w-12 h-12 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-xl font-bold">
                        <input type="text" maxlength="1" class="verification-code-input w-12 h-12 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-xl font-bold">
                        <input type="text" maxlength="1" class="verification-code-input w-12 h-12 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-xl font-bold">
                        <input type="text" maxlength="1" class="verification-code-input w-12 h-12 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-xl font-bold">
                    </div>
                    <p id="codeError" class="text-red-500 text-sm mt-1 hidden"></p>
                    <button id="verifyCodeBtn" class="w-full bg-primary hover:bg-secondary text-white py-3 px-4 rounded-md font-medium">
                        Verify Code
                    </button>
                </div>
        ```

        // Send verification code
        sendCodeBtn.addEventListener('click', async () => {
          const phoneNumber = phoneNumberInput.value.trim();
          
          if (!phoneNumber) {
              phoneError.textContent = 'Please enter a valid phone number';
              phoneError.classList.remove('hidden');
              return;
          }
          
          try {
              sendCodeBtn.disabled = true;
              sendCodeBtn.textContent = 'Sending...';
              
              // Send verification code
              const appVerifier = window.recaptchaVerifier;
              const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
              verificationId = confirmationResult.verificationId;
              
              // Show verification code input
              phoneInputContainer.classList.add('hidden');
              codeInputContainer.classList.remove('hidden');
              
              // Focus on the first verification code input
              verificationInputs[0].focus();
              
              // Handle verification code inputs
              setupVerificationInputs();
          } catch (error) {
              console.error('Error sending verification code:', error);
              phoneError.textContent = error.message || 'Error sending verification code. Please try again.';
              phoneError.classList.remove('hidden');
              sendCodeBtn.disabled = false;
              sendCodeBtn.textContent = 'Send Verification Code';
              
              // Reset reCAPTCHA
              window.recaptchaVerifier.reset(window.recaptchaWidgetId);
              initRecaptcha();
          }
      });

      // Set up verificaiton Inputs
      function setupVerificationInputs() {
          verificationInputs.forEach((input, index) => {
              // Clear existing event listeners
              input.removeEventListener('input', handleVerificationInput);
              input.removeEventListener('keydown', handleVerificationKeyDown);
              
              // Add new event listeners
              input.addEventListener('input', handleVerificationInput);
              input.addEventListener('keydown', handleVerificationKeyDown);
          });
      }
      
      // Handle verification input
      function handleVerificationInput(e) {
          const input = e.target;
          const value = input.value;
          
          // Only allow numbers
          if (/^\d*$/.test(value)) {
              // If value is a digit, move to the next input
              if (value.length === 1) {
                  const nextInput = input.nextElementSibling;
                  if (nextInput && nextInput.classList.contains('verification-code-input')) {
                      nextInput.focus();
          } else {
                      // If it's the last input, check if all fields are filled
                      checkVerificationCompletion();
                  }
              }
          } else {
              // If not a digit, clear the input
              input.value = '';
          }
      }
      
      // Handle verification keydown
      function handleVerificationKeyDown(e) {
          const input = e.target;
          
          // If backspace and the input is empty, focus on the previous input
          if (e.key === 'Backspace' && input.value === '') {
              const prevInput = input.previousElementSibling;
              if (prevInput && prevInput.classList.contains('verification-code-input')) {
                  prevInput.focus();
                  prevInput.value = '';
              }
          }
      }
      
      // Check if all verification inputs are filled
      function checkVerificationCompletion() {
          let isComplete = true;
          let code = '';
          
          verificationInputs.forEach(input => {
              if (input.value === '') {
                  isComplete = false;
              }
              code += input.value;
          });
          
          if (isComplete && code.length === 6) {
              verifyCode(code);
          }
      }
      
      // Verify code manually with button
      verifyCodeBtn.addEventListener('click', () => {
          let code = '';
          let isComplete = true;
          
          verificationInputs.forEach(input => {
              if (input.value === '') {
                  isComplete = false;
                  input.classList.add('border-red-500');
          } else {
                  input.classList.remove('border-red-500');
                  code += input.value;
              }
          });
          
          if (isComplete) {
              verifyCode(code);
          } else {
              codeError.textContent = 'Please enter all 6 digits';
              codeError.classList.remove('hidden');
          }
      });
      
      // Verify the code
      async function verifyCode(code) {
          if (!verificationId) {
              codeError.textContent = 'Verification failed. Please try again.';
              codeError.classList.remove('hidden');
              return;
          }
          
          try {
              // Disable verify button and show loading state
              verifyCodeBtn.disabled = true;
              verifyCodeBtn.textContent = 'Verifying...';
              codeError.classList.add('hidden');
              
              // Create credential
              const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
              
              // Sign in with credential
              const result = await firebase.auth().signInWithCredential(credential);
              
              // User signed in successfully
              currentUser = result.user;
              isLoggedIn = true;
              
              // Show success message
              codeInputContainer.classList.add('hidden');
              authSuccessContainer.classList.remove('hidden');
              
              // Update login button and display user phone
              loginBtn.textContent = 'Log Out';
              const formattedPhoneNumber = formatPhoneNumber(user.phoneNumber);
              userPhoneDisplay.textContent = formattedPhoneNumber;
              userPhoneDisplay.classList.remove('hidden');
              
              // Fetch and populate user data after successful login
              fetchAndPopulateUserData(phoneNumberInput.value);

              // Close modal after a delay
              setTimeout(() => {
                  authModal.classList.add('hidden');
                  resetAuthModal();
              }, 2000);
          } catch (error) {
              console.error('Error verifying code:', error);
              codeError.textContent = 'Invalid verification code. Please try again.';
              codeError.classList.remove('hidden');
              verifyCodeBtn.disabled = false;
              verifyCodeBtn.textContent = 'Verify Code';
              
              // Highlight input fields in red
              verificationInputs.forEach(input => {
                  input.classList.add('border-red-500');
              });
          }
      }
      