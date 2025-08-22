const $ = require('jquery')
const { AccountRequestsApi, UsersApi } = require('../api')
const { AuthLib, ActivityLogLib } = require('../lib')

class Generic {
    /**
     * @returns void
     * @description Set user log out listener.
     */
    static setUserLogOutListener() {
        const logOutButton = document.getElementById('logOutButton')

        logOutButton.addEventListener('click', function() {
            localStorage.removeItem('token')
            sessionStorage.removeItem('activityLog')
            window.location.href = '/login'
        })
    }

    /**
     * @param {string} token
     * @param {Array<Element>} buttons
     * @param {boolean} type
     * @param {Element} topNavbarNotificationCount
     * @returns void
     * @description Set notification buttons.
     */
    static setNotificationButtons(token, buttons, type, topNavbarNotificationCount) {
        buttons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                await AccountRequestsApi.updateUserAccountRequest(token, event.target.id, type)

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
     * @param {string} token
     * @returns {Promise<void>}
     * @description Set notifications.
     */
    static async setNotifications(token) {
        const topNavbarNotificationCount = document.getElementById('topNavbarNotificationCount')
        const dropdownMenu = document.getElementById('topNavbarNotifications')
        dropdownMenu.innerHTML = '<h6 class="dropdown-header">Notifications Center</h6>'
        const notifications = await UsersApi.getUserNotifications(token)

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
        Generic.setNotificationButtons(token, rejectButtons, false, topNavbarNotificationCount)
        const approvedButtons = Array.from(document.getElementsByClassName('notification-approve-button'))
        Generic.setNotificationButtons(token, approvedButtons, true, topNavbarNotificationCount)
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
     * @description Init sidebar toggle.
     */
    static initSidebarToggle() {
        $('#sidebarToggle, #sidebarToggleTop').on('click', () => {
            $('body').toggleClass('sidebar-toggled')
            $('.sidebar').toggleClass('toggled')
            if ($('.sidebar').hasClass('toggled')) {
                $('.sidebar .collapse').collapse('hide')
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
                $('.sidebar .collapse').collapse('hide')
            }

            if ($(window).width() < 480 && !$('.sidebar').hasClass('toggled')) {
                $('body').addClass('sidebar-toggled')
                $('.sidebar').addClass('toggled')
                $('.sidebar .collapse').collapse('hide')
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
                var e0 = e.originalEvent,
                    delta = e0.wheelDelta || -e0.detail
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
            var scrollDistance = $(this).scrollTop()
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
            var $anchor = $(this)
            $('html, body').stop().animate(
                {
                    scrollTop: ($($anchor.attr('href')).offset().top)
                },
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
        Generic.initSidebarToggle()
        Generic.handleWindowResize()
        Generic.preventSidebarScrolling()
        Generic.toggleScrollToTopButton()
        Generic.smoothScroll()

        const token = localStorage.getItem('token')

        if (!token) {
            window.location.href = '/login'
        }

        await AuthLib.validateToken(token)

        Generic.setUserLogOutListener()
        await Generic.setNotifications(token)

        const user = await UsersApi.getUser(token)
        Generic.setTopNavDetails(user.username, user.firstname, user.lastname, user.avatarColor)
    }
}

module.exports = Generic
