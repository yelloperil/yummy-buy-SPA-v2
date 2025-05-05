    <!-- <HEADER /> -->

        <!-- Version 7.0 - HYBRID - structure of old, responsiveness of new -->
        <header class="relative flex flex-col justify-between sm:grid sm:grid-cols-12 items-center gap-y-6 my-2 mb-12 sm:pb-12">

            <!-- Logo + Title Container -->
            <div class="flex flex-row items-start sm:items-center justify-between gap-4 px-1 sm:px-0 w-full sm:col-start-1 sm:col-span-6">
            <!-- <div class="flex flex-row items-center justify-around gap-4 w-full sm:col-start-1 sm:col-span-5"> -->
            <!-- <div class="flex flex-row items-center justify-center w-full sm:col-start-1 sm:col-span-5"> -->
                
                <!-- LOGO -- Pulsating Glow Effect + Expand on Hover -->
                <a href="index.html" class="shrink-0">
                    <img
                        src="/assets/placeholder/mascot-logo-1.png"
                        alt="Yummy Buy Mascot"
                        class="w-36 sm:w-32 md:w-48 lg:w-56 h-auto transition-transform duration-300 ease-in-out hover:scale-125 animate-pulse-glow"
                    /> 
                </a>

                <!-- TITLE TEXT: 呀蜜佰 -->
                <div class="flex flex-col gap-3 pt-2 sm:pt-0 sm:hover:scale-125 transition-transform duration-300 ease-in-out">
                    <h1 class="min-w-[120px] sm:min-w-0">
                        <a href="index.html" class="hidden sm:block font-zenMaru text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-indigo-100 hover:text-secondary sm:hover:scale-125 transition-colors">
                            呀蜜佰 😋
                        </a>
                        <a href="index.html" class="block sm:hidden font-zenMaru text-6xl font-bold text-indigo-100 hover:text-secondary sm:hover:scale-150 transition-colors transition-transform duration-300 ease-in-out hover:scale-110">
                            呀蜜佰
                        </a>
                    </h1>
                </div>

            </div>
            
            <!-- CONTAINER: NAVIGATION LINKS -->
            <div class="w-2/3 self-start sm:self-center sm:block sm:flex sm:justify-center sm:items-center sm:col-start-7 sm:col-span-4">

                <!-- NAVIGATION LINKS -->
                <nav class="w-3/4 flex gap-2 justify-around bg-[#292f3d] px-6 py-1 pb-2 pt-2 outline outline-1 outline-indigo-100 hover:outline-1 hover:outline-indigo-200 rounded-full transition-transform ease-in-out duration-200 hover:scale-102 sm:w-1/2 sm:gap-2 sm:px-9 sm:pb-3 sm:pt-2 sm:outline-3 sm:hover:outline-2 sm:hover:scale-105">

                    <!-- NAVIGATION LINKS: Home -->
                    <span class="text-xs sm:text-base text-[#aca9e4] hover:text-primary font-semibold hover:font-semibold hover:text-sm sm:hover:text-md transition-colors duration-200">
                        <a href="index.html">Home</a>
                    </span>

                    <!-- NAVIGATION LINKS: Products -->
                    <span class="text-xs sm:text-base text-indigo-100 hover:text-primary font-black border-b sm:border-b-2 border-primary hover:border-b sm:hover:border-b-2 hover:border-indigo-100 px-1 transition-colors duration-200">Products</span>
                    
                    <!-- NAVIGATION LINKS: Orders -->
                    <span class="text-xs sm:text-base text-[#aca9e4] hover:text-primary font-semibold hover:font-semibold sm:hover:text-md transition-colors duration-200">
                        <a href="history.html">Your Orders</a>
                    </span>
                    
                </nav>

                <!-- LOGIN BUTTON -->
                <!-- <div class="col-start-10 col-span-3 mr-2">
                    <button id="loginBtnMobile" class="block sm:hidden flex items-center justify-center h-full px-4 py-2 text-xs text-indigo-100 font-black bg-[#4a427f] hover:text-[#f13dc3] hover:bg-primary ml-auto rounded-lg transition-all duration-200 border-invisible hover:border-secondary transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        <p>Log In</p>
                    </button>
                </div> -->

            </div>
            
            <!-- CONTAINER: HIDDEN ADMIN LINK, HIDDEN USER PHONE DISPLAY, LOGIN BUTTON -->
            <div class="w-1/4 absolute right-0 bottom-0 sm:relative sm:col-start-11 sm:col-span-2">
                <div class="relative">
                                
                    <!-- HIDDEN ADMIN LINK -->
                    <h3 id="adminLink" class="hidden absolute right-full translate-y-0.5 translate-x-2">
                        <a href="admin.html" class="sm:block hover:text-[#f13dc3] text-white bg-transparent hover:bg-primary px-4 py-2 text-xs sm:text-base sm:px-8 sm:pt-2 sm:pb-3 sm:pb-2.5 sm:ml-1 rounded-md font-semibold transition-all duration-200 border border-[#f13dc3] hover:border-secondary transform hover:scale-105 focus:ring-2 focus:ring-secondary">
                            Admin
                        </a>
                    </h3>
                    
                    <!-- LOGIN BUTTON -->
                    <button id="loginBtn" class="flex items-center justify-center h-full sm:h-auto px-4 py-2 pt-2 text-xs font-black ml-auto text-indigo-100 sm:font-semibold sm:text-base sm:pb-3 sm:px-8 rounded-lg bg-[#4a427f] hover:text-[#f13dc3] hover:bg-primary transition-all duration-200 border-invisible hover:border-secondary transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        <p>Log In</p>
                    </button>
                    
                    <!-- USER NUMBER DISPLAY -->
                    <div class="absolute bottom-full -translate-y-2/3 sm:top-4 right-0">
                        <!-- USER DISPLAY -->
                        <span id="userPhoneDisplay" class="text-xs sm:text-sm font-bold text-indigo-100 border-b sm:border-b-2 border-[#f13dc3] ml-auto pr-0.5 pb-1">
                            <!-- User's phone number will be displayed here -->
                        </span>
                    </div>
                    
                </div>
            </div>

        </header>