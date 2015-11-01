<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Bootstrap 101 Template</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
	<style>
		.container{
			background-color: #F5F5F5;
			margin-top : 2px;
		}
	</style>
  </head>
  <body>
	<div class='container'>
		<div class='row'>
			<h1 class='text-center'>Send item Guild War</h1>
		</div>
		<form class='form-horizontal'>
			<div class='form-group has-error' id='divCharname'>
				<label class='col-md-2 control-label '>Char Name :</label>
				<div class='col-md-4'>
					<input type='text' class='form-control ' id='txtCharname' >
				</div>				
				<label class='col-md-2 control-label '>Guild Name : </label>
				<div class='col-md-4 has-error' id='divFname'>
					<input type='text' class='form-control' id='txtFname' >
				</div>
			</div>
			<div class='form-group'>
				<label class='col-md-2 control-label'>Guild Id : </label>
				<div class='col-md-4'>
					<input type='text' class='form-control' id='txtFid' placeholder='Auto Guild Id From Char, Guild' readonly='true'>
				</div>
				<label class='col-md-2 control-label'>Item : </label>
				<div class='col-md-4'>
					<input type='text' class='form-control' id='txtItem' placeholder='106,30|203,20|9001,10|'>
				</div>
			</div>
			<div class='form-group'>
				<label class='col-md-2 control-label'>Diamond : </label>
				<div class='col-md-4'>
					<input type='text' class='form-control' id='txtDiamond' value='0'>
				</div>
				<label class='col-md-2 control-label'>Diamond Bind : </label>
				<div class='col-md-4'>
					<input type='text' class='form-control' id='txtDiamondbind' value='0'>
				</div>
			</div>
			<div class='form-group'>
				<label class='col-md-2 control-label'>Subject : </label>
				<div class='col-md-4'>
					<input type='text' class='form-control' id='txtSubject' value='[ระบบ]รางวัลกิจกรรม Guild War' >
				</div>
				<label class='col-md-2 control-label'>Detail : </label>
				<div class='col-md-4'>
					<input type='text' class='form-control' id='txtDetail' value='รางวัลกิจกรรม Guild War'>
				</div>
			</div>
			<div class='form-group'>
				<div class='col-xs-offset-3 col-xs-3 text-center'>
					<input type='button' id='btClear' value='Clear' class='btn btn-default'>
				</div>
				<div class='col-xs-3 text-center'>
					<input type='button' id='btSubmit' class='btn btn-default' value='Submit' disabled='disabled'>
				</div>
			</div>
		</form>
		<div class='row'>
			<div class='col-lg-12'>
				<table class='table table-striped' id='tbSendItem'>
					<thead>
						<tr>
							<th>Row</th>
							<th>Name</th>
							<th>Guild Name</th>
							<th>Birth Lv</th>
							<th>Lv</th>
							<th>Diamond</th>
							<th>Diamond Bind</th>
							<th>Item</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
		</div>
	</div>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>
  </body>
</html>

<script>
    $(document).ready(function(){    
		$("#btClear").click(function(){
			clear();
			setFid();
		});
		$("#txtFname").change(function(){
			checkFid("",$("#txtFname").val());
		});
		$("#txtCharname").change(function(){
			checkFid($("#txtCharname").val(),"");
		});
		$("#txtFid").change(function(){
			setFid();
		});
		$("#btSubmit").click(function(){
			sendItem();
		});
		function checkFid(CharName,FName){
			$.post("checkFid.php",{charname : CharName,fname: FName}).done(function(data){
				//$('#tbSendItem tr:last').after('<tr><td>1</td><td>11</td><td>12</td><td>13</td><td>14</td></tr><tr><td>2</td><td>11</td><td>12</td><td>13</td><td>14</td></tr>');
				//alert( "Data Loaded: " + data );
				$("#txtFid").val(data);
				setFid();
			});
		}
		function sendItem(CharName,FName,FId,Item,Diamond,DiamondBind,Subject,Detail){
			$.post("checkFid.php",{charname : CharName,fname: FName}).done(function(data){
				$('#tbSendItem tr:last').after('<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td></tr>');
			});
		}
		function clear(){
			$("#txtCharname").val("");
			$("#txtFname").val("");
			$("#txtFid").val("");
			$("#txtItem").val("");
			$("#txtDiamond").val("0");
			$("#txtDiamondbind").val("0");
			$("#txtSubject").val("[ระบบ]รางวัลกิจกรรม Guild War");
			$("#txtDetail").val("รางวัลกิจกรรม Guild War");
		}
		function setFid(){
			if($("#txtFid").val()!=""){
				$("#btSubmit").removeAttr('disabled');
				$("#divCharname").removeClass('has-error');
				$("#divFname").removeClass('has-error');
			}else{
				$("#btSubmit").attr('disabled','disabled');
				$("#divCharname").addClass('has-error');
				$("#divFname").addClass('has-error');
			}
		}
	});
</script>

