import { Cursor } from "@phosphor-icons/react";
import { useState, useRef } from "react";

const useCustomDialogs = () => {
    // Toast
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('gray-300');

    const toast = ({ message, type }) => {
        setShowToast(true);
        setToastMessage(message);
        setToastType(type || 'gray-300');
    };

    const resetToast = () => {
        setShowToast(false);
        setToastMessage('');
        setToastType('gray-300');
    };


    // Context menu
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuOptions, setContextMenuOptions] = useState(
        [
            {
                title: 'Action 1',
                action: () => alert('Action 1'),
                icon: <Cursor size={20} className='opacity-50' />,
                textColor: 'success',
            },
            {
                title: 'Action 2',
                action: () => alert('Action 2'),
            },
        ]
    );
    const [contextMenuPosition, setContextMenuPosition] = useState({ left: 15, top: 15 });

    const customContextMenu = ({ options, position }) => {
        setShowContextMenu(true);
        setContextMenuOptions(
            options || [
                {
                    action: () => alert('Action triggered'),
                    title: 'Trigger an action',
                }
            ]
        );
        setContextMenuPosition(position || { left: 15, top: 15 });
    }
    const hideContextMenu = () => {
        setShowContextMenu(false);
    }

    // Confirm Dialog
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
    const [confirmDialogAction, setConfirmDialogAction] = useState(null);
    const [confirmDialogActionText, setConfirmDialogActionText] = useState('Yes, continue');
    const [confirmDialogCloseText, setConfirmDialogCloseText] = useState('Cancel');
    const [confirmDialogCloseCallback, setConfirmDialogCloseCallback] = useState(null);
    const [confirmDialogType, setConfirmDialogType] = useState('gray-700');
    const [confirmDialogActionWaiting, setConfirmDialogActionWaiting] = useState(false);

    const customConfirmDialog = ({ message, action, actionText, closeText, closeCallback, type }) => {
        setShowConfirmDialog(true);
        setConfirmDialogMessage(message);
        setConfirmDialogAction(() => action);
        setConfirmDialogActionText(actionText || 'Yes, continue');
        setConfirmDialogCloseText(closeText || 'Cancel');
        setConfirmDialogCloseCallback(() => closeCallback);
        setConfirmDialogType(type || 'gray-700');
    };

    const resetConfirmDialog = () => {
        setShowConfirmDialog(false);
        setConfirmDialogMessage('');
        setConfirmDialogActionText('Yes, continue');
        setConfirmDialogCloseText('Cancel');
        setConfirmDialogCloseCallback(null);
        setConfirmDialogType('gray-700');
        setConfirmDialogAction(null);
        setConfirmDialogActionWaiting(false);
    };

    // Prompt
    const [showPrompt, setShowPrompt] = useState(false);
    const [promptMessage, setPromptMessage] = useState('');
    const [promptType, setPromptType] = useState('gray-700');
    const [promptInputType, setPromptInputType] = useState('text');
    const [promptSelectInputOptions, setPromptSelectInputOptions] = useState([]);
    const promptInputValue = useRef('');
    const [promptInputPlaceholder, setPromptInputPlaceholder] = useState('Enter value');
    const [promptAction, setPromptAction] = useState(null);
    const [promptActionWaiting, setPromptActionWaiting] = useState(false);

    const customPrompt = ({ message, inputType, selectOptions, action, placeholder, type }) => {
        setShowPrompt(true);
        setPromptMessage(message);
        setPromptInputType(inputType || 'text');
        setPromptSelectInputOptions(selectOptions || []);
        setPromptAction(() => action);
        setPromptInputPlaceholder(placeholder || 'Enter value');
        setPromptType(type || 'gray-700');
    };

    const resetPrompt = () => {
        setShowPrompt(false);
        setPromptMessage('');
        setPromptType('gray-700');
        setPromptInputType('text');
        setPromptSelectInputOptions([]);
        promptInputValue.current = '';
        setPromptInputPlaceholder('Enter value');
        setPromptAction(null);
        setPromptActionWaiting(false);
    };

    return {
        // Toast
        showToast,
        setShowToast,
        toastMessage,
        toastType,
        toast,
        resetToast,

        // Context menu
        showContextMenu,
        setShowContextMenu,
        contextMenuOptions,
        setContextMenuOptions,
        contextMenuPosition,
        setContextMenuPosition,
        customContextMenu,
        hideContextMenu,

        // Confirm Dialog
        showConfirmDialog,
        confirmDialogMessage,
        confirmDialogAction,
        confirmDialogActionText,
        confirmDialogCloseText,
        confirmDialogCloseCallback,
        confirmDialogType,
        confirmDialogActionWaiting,
        setConfirmDialogActionWaiting,
        customConfirmDialog,
        resetConfirmDialog,

        // Prompt
        showPrompt,
        promptMessage,
        promptType,
        promptInputType,
        promptSelectInputOptions,
        promptInputValue,
        promptInputPlaceholder,
        promptAction,
        promptActionWaiting,
        setPromptActionWaiting,
        customPrompt,
        resetPrompt,
    };
};

export default useCustomDialogs;