import debounce from 'lodash.debounce';

function updateStickyness(el, state, updateOffsets) {
    let {
        isSticky,
        placeholder
    } = state;

    if(updateOffsets) {
        let elRect = el.getBoundingClientRect();
        placeholder.style.height = `${elRect.height}px`;
        state.rect = isSticky
            ? placeholder.getBoundingClientRect()
            : elRect;
        state.bottom = window.pageYOffset + state.rect.bottom;
    }

    let isAfterEl = window.pageYOffset + window.innerHeight > state.bottom;

    if(state.isSticky && isAfterEl) {
        el.style.position =  'static';
        placeholder.style.display = 'none';
        el.classList.remove('is-sticky');
    }
    else if(!state.isSticky && !isAfterEl) {
        el.style.position =  'fixed';
        placeholder.style.display = 'block';
        el.classList.add('is-sticky');
    }

    state.isSticky = !isAfterEl;
}


export default {
    inserted(el) {
        console.log('sticky bottom init', el);
        let placeholder = document.createElement('div');
        let state = {
            isSticky:false,
            placeholder,
            idle:true
        };

        placeholder.style.display = 'none';
        el.style.cssText = `bottom:0;left:0;right:0`;
        el.parentNode.insertBefore(placeholder, el);

        updateStickyness(el, state, true);

        const idle = debounce(()=>{
            state.idle = true;
        }, 250);

        el.__stickyBottom = {
            state,
            scrollListener() {
                idle();
                updateStickyness(el, state, state.idle);
                state.idle = false;
            }
        };
        window.addEventListener('scroll', el.__stickyBottom.scrollListener);
    },
    update() {
    },
    componentUpdated(el, bind, vnode) {
        vnode.context.$nextTick(()=>updateStickyness(el, el.__stickyBottom.state, true));
    },
    unbind(el) {
        window.removeEventListener('scroll', el.__stickyBottom.scrollListener);
        el.__stickyBottom = null;
    }
}