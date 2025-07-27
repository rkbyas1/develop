<<<<<<< HEAD
Option Explicit

Private Sub addValue_Change()

End Sub

Private Sub Cancel_Click()
    is_Ok = False
    
    Unload Me
End Sub


Private Sub OK_Click()
    '対象の文字列と前後リストの値を取得し、親フォームの変数に渡す
    addPos_Char = addValue.value
    select_Val = selectList.value
    is_Ok = True
    
    Unload Me
End Sub

Private Sub selectList_Change()

End Sub

Private Sub UserForm_Initialize()
    With selectList
        .AddItem "先頭"
        .AddItem "後方"
        .AddItem "特定文字の後"
        .AddItem "置換"
        .AddItem "削除"
    End With
End Sub
=======
Option Explicit

Private Sub addValue_Change()

End Sub

Private Sub Cancel_Click()
    is_Ok = False
    
    Unload Me
End Sub


Private Sub OK_Click()
    '対象の文字列と前後リストの値を取得し、親フォームの変数に渡す
    addPos_Char = addValue.value
    select_Val = selectList.value
    is_Ok = True
    
    Unload Me
End Sub

Private Sub selectList_Change()

End Sub

Private Sub UserForm_Initialize()
    With selectList
        .AddItem "先頭"
        .AddItem "後方"
        .AddItem "特定文字の後"
        .AddItem "置換"
        .AddItem "削除"
    End With
End Sub
>>>>>>> f8e7df9072f038bae0d0834b12dac710ab66b9da
