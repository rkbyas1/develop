Option Explicit

Private Sub Cancel_Click()
    isOk = False
    
    Unload Me
End Sub


Private Sub OK_Click()
    '対象の文字列と前後リストの値を取得し、親フォームの変数に渡す
    addPosChar = addValue.Value
    selectValue = selectList.Value
    isOk = True
    
    Unload Me
End Sub


Private Sub UserForm_Initialize()
    With selectList
        .AddItem "先頭"
        .AddItem "後方"
        .AddItem "特定文字の後"
        .AddItem "置換"
    End With

    'Application.WindowState = xlMaximized
    
    Me.StartUpPosition = 2
    Me.Height = 180
    Me.Width = Me.Height * 2
    
    Me.Zoom = 120
    
End Sub

