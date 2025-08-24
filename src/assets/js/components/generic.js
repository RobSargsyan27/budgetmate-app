const $ = require('jquery')
const { Collapse } =  require('bootstrap')

const { AccountRequestsApi, UsersApi, AuthApi} = require('../api')
const { ActivityLogLib } = require('../lib')

class Generic {
    /**
     * @returns void
     * @description Set user log out listener.
     */
    static setUserLogOutListener() {
        const logOutButton = document.getElementById('logOutButton')

        logOutButton.addEventListener('click', async () => {
            await AuthApi.logoutUser()
            sessionStorage.removeItem('activityLog')
            window.location.href = '/login'
        })
    }

    /**
     * @param {Array<Element>} buttons
     * @param {boolean} type
     * @param {Element} topNavbarNotificationCount
     * @returns void
     * @description Set notification buttons.
     */
    static setNotificationButtons( buttons, type, topNavbarNotificationCount) {
        buttons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                await AccountRequestsApi.updateUserAccountRequest( event.target.id, type)

                const link = document.getElementById(`${event.target.id}-link`)
                if (link) {
                    link.remove()
                }

                if (parseInt(topNavbarNotificationCount.textContent) - 1 === 0) {
                    topNavbarNotificationCount.style.display = 'none'
                } else {
                    topNavbarNotificationCount.textContent = (parseInt(topNavbarNotificationCount.textContent) - 1)
                        .toString()
                }
            })
        })
    }

    /**
     * @returns {Promise<void>}
     * @description Set notifications.
     */
    static async setNotifications() {
        const topNavbarNotificationCount = document.getElementById('topNavbarNotificationCount')
        const dropdownMenu = document.getElementById('topNavbarNotifications')
        dropdownMenu.innerHTML = '<h6 class="dropdown-header">Notifications Center</h6>'
        const notifications = await UsersApi.getUserNotifications()

        if (notifications.length) {
            topNavbarNotificationCount.textContent = notifications.length

            notifications.forEach(notification => {
                dropdownMenu.innerHTML += `
        <a class="dropdown-item d-flex flex-column" href="#" id="${notification.id}-link">
          <div class="d-flex flex-row">
            <div class="icon-circle bg-primary mr-3">
                <i class="fas fa-info text-white"></i>
            </div>
            <div class="text-gray-500">
                "${notification.requestedUsername}" requested to add "${notification.accountName}" account.
            </div>
          </div>
          <div class="d-flex flex-row justify-content-between mt-2">
            <div class="btn btn-sm btn-danger notification-reject-button" id="${notification.id}">Reject</div>
            <div class="btn btn-sm btn-primary notification-approve-button" id="${notification.id}">Accept</div>
          </div>
        </a>`
            })
        }

        const rejectButtons = Array.from(document.getElementsByClassName('notification-reject-button'))
        Generic.setNotificationButtons(rejectButtons, false, topNavbarNotificationCount)
        const approvedButtons = Array.from(document.getElementsByClassName('notification-approve-button'))
        Generic.setNotificationButtons(approvedButtons, true, topNavbarNotificationCount)
    }

    /**
     * @param {string} username
     * @param {string} firstname
     * @param {string} lastname
     * @param {string} avatarColor
     * @returns void
     * @description Set top nav details.
     */
    static setTopNavDetails(username, firstname, lastname, avatarColor) {
        const topNavUsername = document.getElementById('topNavUsername')
        const topNavAvatar = document.getElementById('topNavAvatar')

        topNavUsername.textContent = username
        topNavAvatar.textContent = `${firstname.substring(0, 1).toUpperCase()} ${
            lastname.substring(0, 1).toUpperCase()
        }`
        topNavAvatar.style.backgroundColor = avatarColor || '#00008B'

        ActivityLogLib.setUserActivityLogDetails()
    }

    /**
     * @returns void
     * @description Hide all sidebar collapses.
     */
    static hideAllSidebarCollapses() {
        document.querySelectorAll('.sidebar .collapse').forEach(el => {
            Collapse.getOrCreateInstance(el, { toggle: false }).hide();
        });
    }

    /**
     * @returns void
     * @description Init sidebar toggle.
     */
    static initSidebarToggle() {
        $('#sidebarToggle, #sidebarToggleTop').on('click', () => {
            $('body').toggleClass('sidebar-toggled')
            $('.sidebar').toggleClass('toggled')
            if ($('.sidebar').hasClass('toggled')) {
                Generic.hideAllSidebarCollapses()
            }
        })
    }

    /**
     * @returns void
     * @description Handle window resize.
     */
    static handleWindowResize() {
        $(window).resize(function() {
            if ($(window).width() < 768) {
                Generic.hideAllSidebarCollapses()
            }
            if ($(window).width() < 480 && !$('.sidebar').hasClass('toggled')) {
                $('body').addClass('sidebar-toggled')
                $('.sidebar').addClass('toggled')
                Generic.hideAllSidebarCollapses()
            }
        })
    }

    /**
     * @returns void
     * @description Prevent sidebar scrolling.
     */
    static preventSidebarScrolling() {
        $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
            if ($(window).width() > 768) {
                const e0 = e.originalEvent
                const delta = e0.wheelDelta || -e0.detail
                this.scrollTop += (delta < 0 ? 1 : -1) * 30
                e.preventDefault()
            }
        })
    }

    /**
     * @returns void
     * @description Toggle scroll to top button.
     */
    static toggleScrollToTopButton() {
        $(document).on('scroll', function() {
            const scrollDistance = $(this).scrollTop()
            if (scrollDistance > 100) {
                $('.scroll-to-top').fadeIn()
            } else {
                $('.scroll-to-top').fadeOut()
            }
        })
    }

    /**
     * @returns void
     * @description Smooth scroll.
     */
    static smoothScroll() {
        $(document).on('click', 'a.scroll-to-top', function(e) {
            const $anchor = $(this)
            $('html, body').stop().animate(
                { scrollTop: ($($anchor.attr('href')).offset().top) },
                1000,
                'easeInOutExpo'
            )
            e.preventDefault()
        })
    }

    /**
     * @returns {Promise<void>}
     * @description Init.
     */
    static async init() {
        try{
            Generic.initSidebarToggle()
            Generic.handleWindowResize()
            Generic.preventSidebarScrolling()
            Generic.toggleScrollToTopButton()
            Generic.smoothScroll()

            Generic.setUserLogOutListener()
            await Generic.setNotifications()

            const user = await UsersApi.getUser()
            Generic.setTopNavDetails(user.username, user.firstname, user.lastname, user.avatarColor)
        }catch (error){
            window.location.href = '/login'
        }
    }
}

module.exports = Generic
