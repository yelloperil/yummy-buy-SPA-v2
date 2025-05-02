
        // Phone number validation and formatting
        phoneNumberInput.addEventListener('input', function(e) {
          
          
                      const rawValue = e.target.value;
          
          
                      let cleanedValue = '';
          
                      // Get raw input value and remove all non-digit characters
                      if (e.target.value.split('').includes('+')) {
                          cleanedValue = rawValue.replace(/\D/g, '').slice(1);
          
                      } else {
                          cleanedValue = rawValue.replace(/\D/g, '');
          
          
                      }          
          
                      // Format the phone number
                      let formattedValue = '';
          
          
                      formattedValue = cleanedValue;
          
          
                      let countryCode = ''
                      let areaCode = ''
                      let middleDigits = ''
                      let lastDigits = ''
                      let spacer = ''
          
                      // Area code
                      if (cleanedValue.length > 0) {
          
          
          
                          countryCode = '+1'
          
                          spacer = ' '.repeat(Math.max(0, 3 - cleanedValue.length))
          
                          if (cleanedValue.length <= 3) {
          
                              
                              areaCode = '(' + cleanedValue.slice(0, Math.min(3, cleanedValue.length)) + spacer + ')'
          
                          }
          
                          if (cleanedValue.length > 3) {
          
                              areaCode = '(' + cleanedValue.slice(0, Math.min(3, cleanedValue.length)) + spacer + ')'
                              middleDigits = ' ' + cleanedValue.slice(3, Math.min(6, cleanedValue.length))
          
                          } 
                          if (cleanedValue.length > 6) {
          
                              areaCode = '(' + cleanedValue.slice(0, Math.min(3, cleanedValue.length)) + spacer + ')'
                              middleDigits = ' ' + cleanedValue.slice(3, Math.min(6, cleanedValue.length))
                              lastDigits = ' - ' + cleanedValue.slice(6, Math.min(10, cleanedValue.length))
          
                          } 
          
                      } else {
                          countryCode = ''
                      }
          
                      // Update the input value with the formatted version
                      e.target.value = countryCode + areaCode + middleDigits + lastDigits;
                      // e.target.value = '+1 ' + formattedValue;
          
          
                      // Auto-focus to send code button after complete entry (10 digits)
                      if (cleanedValue.length === 10) {
          
                          setTimeout(() => {
          
                              sendCodeBtn.focus();
          
                          }, 300);
          
                      }

                  });


                  // Phone Number Input Blur/Focus Logic
                    phoneNumberInput.addEventListener('focus', () => {
                      phoneNumberInput.placeholder = "+1 ";
                  });

                  phoneNumberInput.addEventListener('blur', () => {
                      phoneNumberInput.placeholder = "+1 (604) 969-3855";
                  });