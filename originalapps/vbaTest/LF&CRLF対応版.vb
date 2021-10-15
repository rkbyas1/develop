
Option Explicit
'番号、名前、部署、住所、郵便番号、金種、数量、単価、合計

Dim myFileName As Variant
Dim buf As String, FileName As String

    
'// LFが含まれるかチェック
Sub CheckAndOutput()
    myFileName = Application.GetOpenFilename(FileFilter:="csvファイル(*.csv),*.csv", _
                                                                    Title:="CSVファイルの選択")
    If myFileName = False Then
          Exit Sub
    End If
    'ファイル名切り出し
    FileName = Dir(myFileName)
    
    Open myFileName For Input As #1
        Line Input #1, buf
    
    'LFの場合
    If InStr(buf, vbLf) > 0 Then
        Close #1
        Call CsvToExcel_ForLF(buf)
    'CRLFの場合
    Else
        Call CsvToExcel_CRLF(buf)
    End If
End Sub


'LF改行コード対応版
Sub CsvToExcel_ForLF(buf As String)
    Dim Fcn As Long
    Dim i As Long, j As Long, k As Long
    Dim tmp As Variant
    Dim pos As String, PathName As String
    Dim tmp2 As Variant 'カンマでsplitして格納
    
    Dim index As Long
    Dim data() As String
    Dim col_no As Long
    Dim added As Boolean
    Dim SheetNo As Long
    Dim firstRow As Boolean
    index = 1
    col_no = 3
    added = False
    Fcn = 9
    firstRow = False
    'ブックを追加し、アクティブ化する
    Call CreateNewBook(FileName)
        
    '1行分取得
    tmp = Split(buf, vbLf)
    '書き出し
    For j = 0 To UBound(tmp)
        tmp2 = Split(tmp(j), ",")
        '読込行があれば処理行い、なければ終了
        If UBound(tmp2) > 0 Then
            'ヘッダ行は読み飛ばし
            If j = 0 Then
                GoTo CONTINUE
            '////データ行の読込み
            '2行目（ヘッダ行から数えて）の場合
            ElseIf j = 1 Then
                For i = 0 To UBound(tmp2)
                    'Excelへの書込関数を呼び出す
                    If i = 0 Then
                        Call WriteHeader_LF(tmp2)
                        Call WriteDetail_LF(i, Fcn, tmp2, index)
                    Else
                        Call WriteDetail_LF(i, Fcn, tmp2, index)
                    End If
                Next i
                '前データとして保持
                ReDim data(1)
                data(0) = tmp2(0)
                firstRow = False
            '3行目以降（前データの比較対象）
            Else
                For i = 0 To UBound(tmp2)
                    '前行と同発注番号の場合
                    If data(0) = tmp2(0) Then
                        'Excelへの書込関数を呼び出す
                        Call WriteDetail_LF(i, Fcn, tmp2, index)
                    '前行と異なる発注番号の場合
                    Else
                        '改シート関連処理
                        If Not added Then
                            'ヘッダデータ取得、スタイル修正（関数呼び出し）
                            Call AddStyles(Fcn)
                            Sheets(1).Name = data(0)
                            ' シート追加
                            Worksheets.Add
                            added = True
                            index = 1
                            Fcn = 9
                            'Excelへの書込関数を呼び出す
                            Call WriteHeader_LF(tmp2)
                            For k = 0 To UBound(tmp2)
                                Call WriteDetail_LF(k, Fcn, tmp2, index)
                            Next k
                        End If
                    End If
                Next i
                '前データとして保持
                data(0) = tmp2(0)
            End If
            Fcn = Fcn + 1
            index = index + 1
            added = False
            firstRow = True
        End If
CONTINUE:
    Next j
    '（最終シート対応）ヘッダデータ取得、スタイル修正（関数呼び出し）
    Sheets(1).Name = data(0)
    Call AddStyles(Fcn)
    
End Sub


'CRLF用
Sub CsvToExcel_CRLF(buf As String)
    Dim Fcn As Long
    Dim i As Long, j As Long
    Dim tmp As Variant
    Dim pos As String, PathName As String
    Dim index As Long
    Dim data() As String
    Dim row_no As Long
    Dim added As Boolean
    index = 1
    row_no = 1
    added = False
    Fcn = 8
    
    'ブックを追加し、アクティブ化する
    Call CreateNewBook(FileName)
    
    'CSVデータ行を一行ずつ読込み
    Do Until EOF(1)
        Line Input #1, buf
        Fcn = Fcn + 1 '
        tmp = Split(buf, ",")

        '書き出し
        For i = LBound(tmp) To UBound(tmp)
            '1行目以降の場合
            If row_no <> 1 Then
                '前行と同発注番号の場合
                If data(row_no - 2) = tmp(0) Then
                    'Excelへの書込関数を呼び出す
                    Call WriteDetail_CRLF(i, Fcn, tmp, index)
                '前行と異なる発注番号の場合
                Else
                    '改シート関連処理
                    If Not added Then
                        'ヘッダデータ取得、スタイル修正（関数呼び出し）
                        Call AddStyles(Fcn)
                        ' シート追加
                        Worksheets.Add
                        added = True
                        row_no = 1
                        index = 1
                        i = i - 1
                        Fcn = 9
                    End If
                End If
            '1行目の場合
            Else
                'Excelへの書込関数を呼び出す
                Call WriteDetail_CRLF(i, Fcn, tmp, index)
            End If
        Next i
        '要素追加管理
        If row_no = 1 Then
            ReDim data(1)
            data(0) = tmp(0)
        Else
            ReDim Preserve data(UBound(data) + 1)
            data(UBound(data) - 1) = tmp(0)
        End If
        added = False
        row_no = row_no + 1
        'Sheets(1).Name = "0000" + CStr(index)
        Sheets(1).Name = tmp(0)
        index = index + 1
    Loop
    'ヘッダデータ取得、スタイル修正（関数呼び出し）
    Sheets(1).Cells(2, 6) = tmp(0)
    Call AddStyles(Fcn + 1)
    '不要シートの削除
'    Application.DisplayAlerts = False
'    Sheets(Array("Sheet2", "Sheet3")).Delete
'    Application.DisplayAlerts = True
    Close #1
End Sub

'ブックの追加関数
Public Sub CreateNewBook(FileName As String)
    Dim newBookName As String
    Dim newBookPath As String
    Dim newBook As Workbook
    Dim objFileSys As Object
    
    '新しいファイルの名前を指定
    newBookName = FileName
    Set objFileSys = CreateObject("Scripting.FileSystemObject")
    newBookName = objFileSys.GetBaseName(newBookName)
    '新しいファイルのフルパスを設定
    newBookPath = ThisWorkbook.Path & "\" & newBookName & ".xlsx"
    '新しいファイルを作成
    Set newBook = Workbooks.Add
    '新しいファイルをVBAを実行したファイルと同じフォルダ保存
    newBook.SaveAs newBookPath
End Sub

'スタイル修正用関数
Sub AddStyles(Fcn As Long)
    With Sheets(1)
        '明細ヘッダを作成
        Range("B8") = "№"
        Range("C8") = "品名"
        Range("D8") = "数量"
        Range("E8") = "単価"
        Range("F8") = "金額"
        ' 合計を算出
        Cells(Fcn, 3) = "※ 合　計"
        Cells(Fcn, 6) = WorksheetFunction.Sum(Range(Cells(9, 6), Cells(Fcn - 1, 6)))
        '金額形式の指定
        Range(Cells(9, 4), Cells(Fcn, 6)).NumberFormatLocal = "#,###"
        Cells(2, 5) = "発注№："
        Cells(5, 4) = "御中"
        '明細ヘッダ色指定
        Range(Cells(8, 2), Cells(8, 6)).Interior.Color = RGB(220, 230, 241)
        'フォント
        Range("A1:X100").Font.Name = "ＭＳ Ｐゴシック"
        Range(Cells(8, 2), Cells(Fcn, 6)).Font.Size = 14
        Range("C2:F6").Font.Size = 10
        Cells(5, 3).Font.Size = 12
        'タイトル
        Range("B1:F1").Merge
        Range("B1") = "納　品　書"
        Range("B1").HorizontalAlignment = xlCenter
        Range("B1").Font.Size = 16
        Range("B1").Font.Underline = xlUnderlineStyleDouble
        Range("B1").Font.Bold = True
        '罫線
        Range(Cells(8, 2), Cells(Fcn, 6)).Borders(xlEdgeBottom).LineStyle = xlContinuous
        Range(Cells(8, 2), Cells(Fcn, 6)).Borders(xlEdgeTop).LineStyle = xlContinuous
        Range(Cells(8, 2), Cells(Fcn, 6)).Borders(xlInsideHorizontal).LineStyle = xlContinuous
        Range(Cells(8, 2), Cells(8, 6)).Borders(xlEdgeBottom).LineStyle = xlDouble
        '行幅、高さ
        Range(Cells(8, 2), Cells(Fcn, 6)).EntireRow.RowHeight = 18
        Columns(1).ColumnWidth = 2
        Columns(2).ColumnWidth = 4.63
        Columns(3).ColumnWidth = 31.88
        Columns(4).ColumnWidth = 9.25
        Columns(5).ColumnWidth = 13.13
        Columns(6).ColumnWidth = 13.5
        Columns(7).ColumnWidth = 1.75
        Rows(1).RowHeight = 18.75
        Rows(2).RowHeight = 12
        Rows(3).RowHeight = 6
        Rows(4).RowHeight = 31.5
        Rows(5).RowHeight = 14.25
        Rows(6).RowHeight = 17.25
        Rows(7).RowHeight = 12
        '寄せ
        Columns(2).HorizontalAlignment = xlCenter
        Range("C5").HorizontalAlignment = xlRight
        Range("F2").HorizontalAlignment = xlLeft
        Range("E2").HorizontalAlignment = xlRight
        Range("D8:F8").HorizontalAlignment = xlRight
        Range("C4").VerticalAlignment = xlTop
    End With
End Sub


'明細情報書込み関数（LF）
Sub WriteDetail_LF(i As Long, Fcn As Long, tmp As Variant, index As Long)
    Dim dataIndex As Long
    Dim colNo As Long
    dataIndex = i + 5
    colNo = i + 3
    
    With Sheets(1)
        '行番号
        Cells(Fcn, 2).Value = index
        '明細書き出しデータ
        If dataIndex <= 8 Then
            Cells(Fcn, colNo).Value = tmp(dataIndex)
        End If
    End With
End Sub

'ヘッダ情報書込み関数（LF）
Sub WriteHeader_LF(tmp As Variant)
    With Sheets(1)
        '発注番号
        Cells(2, 6) = tmp(0)
        '依頼者名
        Cells(5, 3) = tmp(1)
        '出納区部署
        Cells(6, 3) = tmp(2)
        '住所
        Cells(4, 3) = tmp(3)
        '郵便番号
        Cells(2, 3) = "〒" & tmp(4)
    End With
End Sub


'データ書き込み（CRLF）
Sub WriteDetail_CRLF(i As Long, Fcn As Long, tmp As Variant, index As Long)
    With Sheets(1)
        '発注番号は明細に追加しない
        If i = 0 Then
            Cells(2, 6) = tmp(0)
            '行番号
            Cells(Fcn, 2).Value = index
        '依頼者名
        ElseIf i = 1 Then
            Cells(5, 3) = tmp(1)
        '出納区部署
        ElseIf i = 2 Then
            Cells(6, 3) = tmp(2)
        '住所
        ElseIf i = 3 Then
            Cells(4, 3) = tmp(3)
        '郵便番号
        ElseIf i = 4 Then
            Cells(2, 3) = "〒" & tmp(4)
        'その他の明細値は順番に書き込んでいく
        Else
            Cells(Fcn, i - 2).Value = tmp(i)
        End If
    End With
End Sub

