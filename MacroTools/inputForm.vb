Option Explicit

Private Sub cancel_Click()
    bool_cancel = True
    
    Unload Me
End Sub


Private Sub OK_Click()
    cell_val = inputcell.value
    txt_val = inputvalue.value
    bool_cancel = False
    
    Unload Me
End Sub